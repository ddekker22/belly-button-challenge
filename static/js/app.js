//Pull data from URL: json
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(dataURL).then(function(response) {
    console.log(response);
});

//Initialize the page with the init function: Creates the initial dropdown and charts that will be restyled
function init(){
    //setup dropdown menu
    let dropdown = d3.select("#selDataset");

    //pull in the data from the URL
    d3.json(dataURL).then((data) =>{
        //"names" in the  json file are actually the IDs for each bellybutton sample
        let sampleIDs = data.names;
        console.log(sampleIDs);

        //add values to the dropdown
        for (id of sampleIDs){
            dropdown.append('option').attr('value', id).text(id); 
        };

        //add in a value
        let initialDDSample = sampleIDs[0];
        console.log(initialDDSample);

        //Create the initial barchart, bubblechart and metadata which will later be overwritten
        barChart(initialDDSample);
        bubbleChart(initialDDSample);
        metadataChart(initialDDSample);
    });
};

//Create the horizontal bar chart
function barChart(sample){

    d3.json(dataURL).then((data) => {
    
        let sampleValue = data.samples;
        let results = sampleValue.filter(id => id.id == sample);
        let sampleResults = results[0];
        console.log(sampleResults);

        //get the ID, label, and values for each OTU sample
        let otuIDs = sampleResults.otu_ids;
        let otuLabels = sampleResults.otu_labels;
        let sampleValues = sampleResults.sample_values;

        //log the results to the console:
        console.log(otuIDs, otuLabels, sampleValues)


        //Slice the top ten values to display on the dashboard:
        let topTenIDs = otuIDs.slice(0,10).map(id => `OTU ${id}`).reverse();
        let topTenValues = sampleValues.slice(0,10).reverse();
        let topTenLabels = otuLabels.slice(0,10).reverse();

        //set the values for the various bar graph parameters
        let barTrace = {
            x: topTenValues,
            y: topTenIDs,
            text: topTenLabels,
            type: 'bar',
            orientation: 'h'

        };

        //create the layout
        let layout = {
            title: `Top 10 OTUs for Sample: ${sample}`
        };
        
        //combine into the new bar graph
        Plotly.newPlot('bar', [barTrace], layout)

    });
};

//Create the horizontal bar chart
function bubbleChart(sample){

    d3.json(dataURL).then((data) => {
    
        let sampleValue = data.samples;
        let results = sampleValue.filter(id => id.id == sample);
        let sampleResults = results[0];
        console.log(sampleResults);

        //get the ID, label, and values for each OTU sample
        let otuIDs = sampleResults.otu_ids;
        let otuLabels = sampleResults.otu_labels;
        let sampleValues = sampleResults.sample_values;

        //log the results to the console:
        console.log(otuIDs, otuLabels, sampleValues)

        //set the values for the various chart parameters
        let bubbleTrace = {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: 'Earth'
            }
        };
        //create the layout for the graph
        let layout = {
            title: `Bacteria Count`,
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Values'}
        };
        
        //combine the values into the new bubble chart
        Plotly.newPlot('bubble', [bubbleTrace], layout)

    });
};

function metadataChart(sample){

    d3.json(dataURL).then((data) => {
        //pull the metadata for the sample chosen from the dropdown
        let metadata = data.metadata;
        let sampleValue = metadata.filter(id => id.id == sample);

        //log the results to the console
        console.log(sampleValue);


        //results needed: id, ethnicity, gender, age, location, bbtype, wfreq
        //All of these values lie within the first list item of 'metadata'
        let metadataValues = sampleValue[0];
        
        //Remove chart data from previous selection and replace it with the selection
        d3.select('#sample-metadata').html('');

            //select each key, value pair and add it to the chart
        Object.entries(metadataValues).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('h5').text(`${key}: ${value}`);
        });
            
    
                

    });
};

//Function to update the graphs when a new dropdown option is selected:
function optionChanged(selection){
    console.log(selection);

    //Display each of the charts with the option selected from the DropDown Menu
    barChart(selection);
    bubbleChart(selection);
    metadataChart(selection);

};




init();
