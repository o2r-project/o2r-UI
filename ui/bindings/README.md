# o2r-bindings

[![](https://images.microbadger.com/badges/version/o2rproject/o2r-bindings.svg)](https://microbadger.com/images/o2rproject/o2r-bindings "Get your own version badge on microbadger.com") [![](https://images.microbadger.com/badges/image/o2rproject/o2r-bindings.svg)](https://microbadger.com/images/o2rproject/o2r-bindings "Get your own image badge on microbadger.com")

Linking data, text, and code to make research results transparent and better accessible.

Many geoscientific papers include computational results produced by source code and data, e.g. numbers, maps, and time series. Increasingly, papers provide access to the underlying materials as supplements. However, these can be complex including several files each having numerous code lines or data columns. Identifying those parts of the code and the dataset underlying a specific result can be a time-consuming task for readers and reviewers. A binding links a specific computational result to those code lines and data subsets used to produce that result. We develop a prototypical web applications for authors of scientific publications to create bindings and readers to use them while examining a paper. The resulting benefits for readers and reviewers are twofold: First, they can better understand how specific results were achieved and easily change parameters in the code with the help of user interface widgets, e.g. a slider. Second, readers can better build upon published research by reusing existing materials resulting in acknowledgement for the author and less work for the reader. While this work presents bindings for geoscientific papers, it is applicable to other domains including computational results, too.

## Development

If you make changes to the codebase of the bindings service, you can trigger a rebuild of the Docker image with

```bash
docker-compose build bindings
```

## License

o2r-bindings is published under Apache Software License, Version 2.0 - see file `LICENSE`.
