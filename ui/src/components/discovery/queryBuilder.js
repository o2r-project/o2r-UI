export default function prepareQuery(term, coordinates_selected, from, to, start, size, libraries) {

    var query = {
            query: {
                "bool": {
                    "must": {},
                    "filter": []
                }
            }
        };

    if(term){
        if(libraries){
                query.query.bool.must.match = {
                    "metadata.o2r.depends.identifier": term
                }
        } else {
                query.query.bool.must.match = {
                    "_all": term
                }
            }
    }
    else {
        query.query.bool.must= {
            "match_all": {}
        }
    }
    if(from){
        query.query.bool.filter.push({
            "range": {
                "metadata.o2r.temporal.begin": {
                    "from": from
                }
            }
        });
    }
    if(to){
        query.query.bool.filter.push({
            "range": {
                "metadata.o2r.temporal.end": {
                    "to": to
                }
            }
        });
    }
    if(coordinates_selected){
        query.query.bool.filter.push({
            "geo_shape": {
                "metadata.o2r.spatial.union.geojson.geometry": {
                    "shape": coordinates_selected,
                    "relation": "within"
                }
            }
        });
    }
    if((start === 0) || start){
        query.from = start;
    }
    if(size){
        query.size = size;
    }
    return query;
}
