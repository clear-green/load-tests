/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 60.524876981957355, "KoPercent": 39.475123018042645};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06027884089666485, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "GET Kopeeri teenus/toode 50"], "isController": false}, {"data": [0.0, 500, 1500, "POST Lae tooted/teenused 150"], "isController": false}, {"data": [0.0, 500, 1500, "POST Kommenteeri teenust/toodet 50"], "isController": false}, {"data": [0.0, 500, 1500, "GET Lae Ostukorv 200"], "isController": false}, {"data": [0.0, 500, 1500, "GET Lae Ostukorv 100"], "isController": false}, {"data": [0.1423076923076923, 500, 1500, "GET Lae Ostukorv 50"], "isController": false}, {"data": [0.0, 500, 1500, "POST Lae tooted/teenused 100"], "isController": false}, {"data": [0.0, 500, 1500, "POST Lae tooted/teenused 200"], "isController": false}, {"data": [0.0, 500, 1500, "GET Lae Ostukorv 150"], "isController": false}, {"data": [0.18055555555555555, 500, 1500, "POST Lisa toode ostukorvi 50"], "isController": false}, {"data": [0.0, 500, 1500, "GET Kopeeri teenus/toode 150"], "isController": false}, {"data": [0.015306122448979591, 500, 1500, "POST Eemalda teenust/toodet 200"], "isController": false}, {"data": [0.19902912621359223, 500, 1500, "POST Eemalda teenust/toodet 100"], "isController": false}, {"data": [0.0, 500, 1500, "POST Kommenteeri teenust/toodet 150"], "isController": false}, {"data": [0.3374485596707819, 500, 1500, "POST Eemalda teenust/toodet 50"], "isController": false}, {"data": [0.0, 500, 1500, "POST Kommenteeri teenust/toodet 200"], "isController": false}, {"data": [0.2642857142857143, 500, 1500, "POST Eemalda teenust/toodet 150"], "isController": false}, {"data": [0.0, 500, 1500, "GET Kopeeri teenus/toode 200"], "isController": false}, {"data": [0.0, 500, 1500, "GET Kopeeri teenus/toode 100"], "isController": false}, {"data": [0.0, 500, 1500, "POST Kommenteeri teenust/toodet 100"], "isController": false}, {"data": [0.0, 500, 1500, "POST Lisa toode ostukorvi 150"], "isController": false}, {"data": [0.0, 500, 1500, "POST Lisa toode ostukorvi 100"], "isController": false}, {"data": [0.008583690987124463, 500, 1500, "POST Lae tooted/teenused 50"], "isController": false}, {"data": [0.0, 500, 1500, "POST Lisa toode ostukorvi 200"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3658, 1444, 39.475123018042645, 9489.764625478405, 209, 57005, 3574.0, 29642.599999999995, 37034.74999999997, 46918.59999999999, 1.8127127757102435, 107.43689870343093, 13.919519542690178], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Kopeeri teenus/toode 50", 248, 248, 100.0, 1513.383064516129, 209, 4591, 1129.5, 2978.4, 3427.0999999999995, 4368.119999999997, 4.048979591836734, 3.748469387755102, 3.2621173469387754], "isController": false}, {"data": ["POST Lae tooted/teenused 150", 32, 0, 0.0, 9065.4375, 4671, 12917, 8675.0, 12527.2, 12756.449999999999, 12917.0, 2.360230122436938, 559.1270490669715, 2.565367310812804], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 50", 238, 238, 100.0, 1251.5630252100839, 257, 4996, 903.5, 2343.3999999999996, 3092.2999999999993, 4246.98, 3.921697864487214, 3.630634351107303, 156.6802552090199], "isController": false}, {"data": ["GET Lae Ostukorv 200", 200, 54, 27.0, 31552.12000000002, 4475, 50570, 35112.5, 46417.0, 46730.75, 50530.0, 3.952022447487501, 762.0013736365522, 3.1145333155492323], "isController": false}, {"data": ["GET Lae Ostukorv 100", 171, 0, 0.0, 15165.333333333328, 3861, 25379, 15186.0, 22806.4, 24970.0, 25276.04, 2.233017315678132, 461.05192836470655, 1.7598095446799342], "isController": false}, {"data": ["GET Lae Ostukorv 50", 260, 0, 0.0, 2604.3307692307694, 425, 8680, 2286.5, 4505.3, 5175.499999999999, 6714.779999999989, 4.088757489502901, 321.9723291371149, 3.2222922793250404], "isController": false}, {"data": ["POST Lae tooted/teenused 100", 100, 0, 0.0, 12161.17, 3563, 34397, 11669.5, 19716.800000000007, 22750.29999999999, 34296.55999999995, 2.1836445026749645, 368.9254379230811, 2.3734339174582377], "isController": false}, {"data": ["POST Lae tooted/teenused 200", 139, 24, 17.26618705035971, 23659.129496402886, 5315, 38311, 23015.0, 36715.0, 37441.0, 38246.2, 3.4026927784577725, 668.8955161796206, 3.6984346312729497], "isController": false}, {"data": ["GET Lae Ostukorv 150", 150, 3, 2.0, 30294.293333333342, 4736, 57005, 30333.5, 52640.3, 55043.59999999997, 56855.060000000005, 2.631163500499921, 673.9274445701556, 2.073582954007262], "isController": false}, {"data": ["POST Lisa toode ostukorvi 50", 216, 0, 0.0, 2205.1064814814813, 256, 7489, 1812.0, 4121.8, 4637.899999999991, 6804.6799999999985, 3.691676636472398, 3.53665505896428, 3.7133075542642286], "isController": false}, {"data": ["GET Kopeeri teenus/toode 150", 150, 150, 100.0, 21055.8, 539, 46820, 22252.0, 36313.600000000006, 37023.4, 43862.00000000005, 2.456761006289308, 2.269944804769392, 1.9793240529186322], "isController": false}, {"data": ["POST Eemalda teenust/toodet 200", 196, 3, 1.530612244897959, 6738.30612244898, 1029, 37920, 2427.0, 20710.80000000002, 25153.6, 36692.950000000004, 3.2064915093413604, 3.0691758877155384, 2.633456405621176], "isController": false}, {"data": ["POST Eemalda teenust/toodet 100", 103, 0, 0.0, 3233.9320388349515, 627, 21116, 1548.0, 11777.600000000008, 14811.4, 20927.35999999997, 1.7219473050688778, 1.6496389709693058, 1.4142164878544201], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 150", 122, 122, 100.0, 4847.622950819672, 707, 10149, 5869.0, 6448.6, 7012.5499999999965, 10029.169999999998, 10.888968225633702, 10.08080261513745, 435.03767488173867], "isController": false}, {"data": ["POST Eemalda teenust/toodet 50", 243, 0, 0.0, 1586.444444444445, 221, 7537, 1056.0, 3274.199999999999, 4036.7999999999984, 6382.000000000003, 3.985893545476913, 3.8185171563602065, 3.273570773189535], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 200", 177, 177, 100.0, 6087.892655367231, 986, 37823, 2409.0, 19056.6, 19100.0, 36887.78, 4.254705415735199, 3.935733966731569, 169.9846223272878], "isController": false}, {"data": ["POST Eemalda teenust/toodet 150", 140, 0, 0.0, 4713.635714285714, 650, 31272, 1211.5, 11416.1, 12011.65, 31263.8, 3.189356661199198, 3.0554285982777474, 2.6193837422544193], "isController": false}, {"data": ["GET Kopeeri teenus/toode 200", 200, 200, 100.0, 15152.875, 629, 42374, 13253.5, 34635.4, 38549.75, 42271.18, 2.4774551580616393, 2.285113668739471, 1.9959965873055199], "isController": false}, {"data": ["GET Kopeeri teenus/toode 100", 121, 121, 100.0, 10118.37190082644, 1117, 20941, 10161.0, 17043.6, 18971.2, 20936.82, 1.7216601926551984, 1.5938807252315703, 1.3870797450591197], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 100", 100, 100, 100.0, 3158.8, 598, 15892, 2466.0, 5267.500000000001, 9349.399999999992, 15857.099999999982, 3.528457005751385, 3.266579337355774, 140.96943804911612], "isController": false}, {"data": ["POST Lisa toode ostukorvi 150", 3, 0, 0.0, 5131.666666666667, 4439, 6304, 4652.0, 6304.0, 6304.0, 6304.0, 0.47588832487309646, 0.45590473310596447, 0.4786767330266497], "isController": false}, {"data": ["POST Lisa toode ostukorvi 100", 96, 0, 0.0, 11856.718749999998, 2843, 23955, 11887.5, 18707.0, 21601.849999999988, 23955.0, 2.1321961620469083, 2.042660581023454, 2.144689498933902], "isController": false}, {"data": ["POST Lae tooted/teenused 50", 233, 0, 0.0, 3774.6523605150214, 1291, 8121, 3391.0, 5705.599999999999, 6477.399999999997, 8050.28, 3.851112359921986, 496.07635000702453, 4.185828180266768], "isController": false}, {"data": ["POST Lisa toode ostukorvi 200", 20, 4, 20.0, 25690.100000000002, 16196, 33353, 27349.0, 33109.6, 33341.25, 33353.0, 0.5961962678113635, 0.5590504456567102, 0.5996896053180707], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 1349, 93.42105263157895, 36.87807545106616], "isController": false}, {"data": ["500", 95, 6.578947368421052, 2.59704756697649], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3658, 1444, "400", 1349, "500", 95, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET Kopeeri teenus/toode 50", 248, 248, "400", 248, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 50", 238, 238, "400", 238, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Lae Ostukorv 200", 200, 54, "500", 50, "400", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Lae tooted/teenused 200", 139, 24, "500", 23, "400", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Lae Ostukorv 150", 150, 3, "400", 2, "500", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Kopeeri teenus/toode 150", 150, 150, "400", 146, "500", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Eemalda teenust/toodet 200", 196, 3, "400", 2, "500", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 150", 122, 122, "400", 122, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 200", 177, 177, "400", 175, "500", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Kopeeri teenus/toode 200", 200, 200, "400", 190, "500", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Kopeeri teenus/toode 100", 121, 121, "400", 121, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Kommenteeri teenust/toodet 100", 100, 100, "400", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Lisa toode ostukorvi 200", 20, 4, "500", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
