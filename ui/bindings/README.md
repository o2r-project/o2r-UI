# o2r-bindings

[![](https://images.microbadger.com/badges/version/o2rproject/o2r-bindings.svg)](https://microbadger.com/images/o2rproject/o2r-bindings "Get your own version badge on microbadger.com") [![](https://images.microbadger.com/badges/image/o2rproject/o2r-bindings.svg)](https://microbadger.com/images/o2rproject/o2r-bindings "Get your own image badge on microbadger.com")

Linking data, text, and code to make research results transparent and better accessible.

Many geoscientific papers include computational results produced by source code and data, e.g. numbers, maps, and time series. Increasingly, papers provide access to the underlying materials as supplements. However, these can be complex including several files each having numerous code lines or data columns. Identifying those parts of the code and the dataset underlying a specific result can be a time-consuming task for readers and reviewers. A binding links a specific computational result to those code lines and data subsets used to produce that result. We develop a prototypical web applications for authors of scientific publications to create bindings and readers to use them while examining a paper. The resulting benefits for readers and reviewers are twofold: First, they can better understand how specific results were achieved and easily change parameters in the code with the help of user interface widgets, e.g. a slider. Second, readers can better build upon published research by reusing existing materials resulting in acknowledgement for the author and less work for the reader. While this work presents bindings for geoscientific papers, it is applicable to other domains including computational results, too.

## extractR

Part of the [o2r-bindings](https://github.com/o2r-project/o2r-bindings) service is **extractR**. This algorithm allows automated extraction of codelines. These could then be used to recreate certain figures and plots from scientific papers. The basic steps of the algorithm are:
* [Read *.Rmd* file](#File-Processing)
* [Classify each line](#Classification-of-lines)
* [Process the classification](#Classification-processing)
* [Extract variables from classification](#Variable-extraction)
* [Read code lines from extracted classification](#Reading-codelines)

### File Processing
The corresponding code for the first file processing can be found [here](./controllers/generalFunctions.js). As input of the algorithm, a R Markdown file ,including all code chunks which are needed to create the desired figure, is used. This file is then split into lines. From these lines, empty ones are excluded for faster processing. The outcome of this first step is an array of objects of the form: 
```javascript
[...,{"value":{'Here is the code line'},"codeBlock": 1, "Line": 20, "index": 24},...]
```
Therefore, the object includes:
* **Value**: The specific code line 
* **codeBlock**: As R Markdown documents usually have multiple code blocks, the number of the chunk is saved.
* **Line**: The position of the specific value in the file, i.e. it is the 20<sup>th</sup> line which is processed.
* **index**: The index corresponds to the position of the specific line in the original Markdown file.This is important for further processing inside the bindings service as it represents the front-end line index.  

### Classification of lines 
After the first processing, each object is classified as one of the following types (Examples in brackets):
* **variable** (```a = X```)
* **function** (```a = function(a,b){```)
* **inlineFunction** (```a = raster(b)```)
* **exFile** (```load("abc.data")```)
* **library** (```library(raster)```)
* **forLoop** (```for(a in b){```)
* **whileLoop** (```while(i < 7){```)
* **repeatLoop** (```repeat{...}```)
* **variable call** (```plot1```)
* **conditional** (```if(a > 7){```)
* **sequence**: (```a[6:9]```)

A **function** is a self-written function that can be found in the Markdown file, while an **inlineFunction** is a function that is called inside the script, which can be a self-written one as well as one called from an external file or library. External files and libraries included in the script are of type **exFile** and **library**. Then, the possible R loop types are cassified as **forLoop**,**whileLoop** and **repeatLoop**. For the type **conditional**, *if* and *if else* statements are examples. If a variable is called inside the Markdown file, the line is classified as **variable call**. Moreover, a **sequence** is characterized by a "*:*", which is the case while subsetting in R. The type is added at the end of each object. 

### Classification processing 
After the type is added to each object, it is processed differently depending on the type. The corresponding code can be found [here](./controllers/rules.js#154). At the end, a possible result looks like this:
```javascript
 [...,{
    "json": {
      "value": "PlotFigure1 = function(Tracks.df){",
      "codeBlock": 8,
      "Line": 66,
      "index": 118,
      "type": "function",
      "content": {
        "vars": [
          "Tracks.df"
        ],
        "name": "PlotFigure1 "
      }
    },
    "end": 90,
    "index": 118,
    "endIndex": 146
  },
  {
    "json": {
      "value": "PlotFigure1(Tracks.df)",
      "codeBlock": 8,
      "Line": 91,
      "index": 148,
      "type": "inlineFunction",
      "call": "PlotFigure1",
      "content": [
        {
          "args": {
            "value": [
              "Tracks.df"
            ]
          },
          "type": [
            "variable call"
          ]
        }
      ]
    },
    "index": 148
  }
]
```
Here, the object from the File Processing is extended by a **content** entry. This entry holds information about the inner content of a specific type. In the example, the **inlineFunction** *PlotFigure1* has the parameter *Tracks.df*, which is added to the content. If the type found in a specific line is a multiline type, which means that it is probably a loop or a self-written function, an **end** parameter is added to the object. This parameter describes the end-line of the function in the internal representation, while the **index** parameter represents the start of the function and the **endIndex** parameter represents the end in the frontend representation. If the multiline type would be a *loop* or an *if*, every line inside would get its own representation under **content**. 

Since this representation gets quite confusing for larger files, the **content** of each entry gets further processed. The function [getVarsAndValuesOfLines](./controllers/processJson.js#L55) simplifies the previous representation like you can see here: 
```javascript
[...{ start: 384,
    end: 390,
    vars: 
     [ '!uncert',
       'modelOutput',
       'he',
       'velocity',
       'duration',
       'sediment',
       'q',
       'FA',
       'IA',
       'BA',
       'EP',
       'IH',
       'BH',
       'GL',
       'NF',
       'BT',
       'BS',
       'PD',
       'PT',
       'FL',
       'YY',
       'LM',
       'repVal',
       'up',
       'uncert' ],
    type: 'conditional',
    name: '!uncert',
    codeBlock: 1 },...
    ]
```
Every object has now the elements
* **start**: represents the frontend start index
* **end**: represents the frontend end index, start == end in case of single lines
* **vars**: represents every variable found indside start and end
* **type**: type of the element found at line at index *start*
* **name**: represents the name of the type found at index *start*
* **codeBlock**: represents the R Markdown code chunk index where the element was found

### Variable extraction
Now, every row of the Markdown File has been processed. Now, the variables, and therefore codelines, needed to recreate a specific figure are required. As input, **extractR** expects a function as input of the form  ```PlotFigureX(he,..) ```. Then, the function [valuesToSearchFor()](./controllers/processJson.js#L364) extracts the parameters of the function. Those are the starting point for the function [getAllCodeLines](./controllers/processJson.js#L378). This function loops through the object created in the [classification processing](#Classification-processing) and finds every line, where those parameters exist. The function is then called recursivly with the variables found in those lines again and again. The result of this function is 
```javascript
[ { start: 17, end: 17, codeBlock: 1 },
  { start: 18, end: 18, codeBlock: 1 },
  { start: 19, end: 19, codeBlock: 1 },
  { start: 24, end: 24, codeBlock: 2 },
  { start: 25, end: 25, codeBlock: 2 },
  { start: 26, end: 26, codeBlock: 2 }...]
```
Those codelines represent the needed lines from the R Markdown file for the plot created inside the function ```PlotFigureX(he,..) ```. The function can be seen [here](./controllers/processJson.js#L463). 
### Reading codelines 
The lines extracted in the previous step are then grouped if those are consecutive lines. As a final result, an object array of the following form is created:
```javascript
[ { start: 31, end: 31 },
  { start: 40, end: 340 },
  { start: 345, end: 349 },
  { start: 355, end: 362 },
  { start: 365, end: 371 },
  { start: 375, end: 375 },
  { start: 378, end: 379 },
  { start: 382, end: 382 },
  { start: 384, end: 410 },
  { start: 412, end: 412 },
  { start: 414, end: 430 },
  { start: 432, end: 432 } ]
```
This is the final result of the algorithm, including each line that is necessary to recreate a certain plot.    
## Installation
To run the algorithm, run ```npm install``` and afterwards ```npm start```. The file that should be processed must be a R Markdown file. The link to the file has to be inserted in the file *extractR.js* inside the function *implementExtractR* called at the end of the script. 

## API
The API endpoint of extractR can be reached by

```POST /api/v1/bindings/extractR```

and needs the following parameters:
* **file**: Name of the R Markdown file, e.g. *main.Rmd*
* **id**: The corresponding compendium id
* **plot**: The value of the plot function, e.g. *PlotFigure1(Tracks.df,vals)*

A response looks like this:

```JSON
{"callback":"ok",
"data":{
    "id":"gV1VO",
    "plot":"PlotFigure1(Tracks.df,vals)",
    "file":"main.Rmd",
    "codelines":[
        {"start":17,"end":19},
        {"start":23,"end":29},
        {"start":35,"end":36},
        {"start":38,"end":40},
        {"start":46,"end":47},
        {"start":49,"end":51},
        {"start":53,"end":55},
        {"start":60,"end":63},
        {"start":65,"end":67},
        {"start":69,"end":77},
        {"start":81,"end":93},
        {"start":98,"end":99},
        {"start":101,"end":101},
        {"start":103,"end":103},
        {"start":105,"end":107},
        {"start":109,"end":112},
        {"start":118,"end":119},
        {"start":145,"end":145}]
    }
}
```

## Requirements and Constraints
* Opening brackets (i.e. *'('*, *'{'*, *'['* ) must be in the same line as the loop or function itself.
* Closing brackets of functions or loops must be placed at an exclusive line.
* Spacing between variables: Up to one space is allowed.
* Avoid more than one closing bracket ( *'('* ) for variable values or use a single line definition.
* The codepart responsible for the plot must be wrapped into a function called *PlotFunctionX()*. This function must include the necessary plot parameters, e.g. *PlotFunctionX(a,b,c)*. For Examples see [here](https://github.com/MarkusKonk/erc-examples/tree/master/ERC/Finished/insyde_extractR) 


## Future work
The following points should be adressed in the future:
* The algorithm sometimes gets far more matches and lines than necessary for a specific plot.
* Highlight found lines in the UI and enable user to delete unnecessary lines / add missed lines.
* Special syntax (like in the following example) is not working:
```R
a = c %>%
  mutate(.data) %>%
  filter(c > 5)
```

## License

o2r-bindings is published under Apache Software License, Version 2.0 - see file `LICENSE`.
