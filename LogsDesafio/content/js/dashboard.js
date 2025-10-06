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

    var data = {"OkPercent": 98.67279173116293, "KoPercent": 1.3272082688370699};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9724921356169172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Realizar login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar login-1"], "isController": false}, {"data": [0.5, 500, 1500, "Excluir usuários"], "isController": false}, {"data": [0.5, 500, 1500, "Login-0"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar Login 2-0"], "isController": false}, {"data": [0.5, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar Login 2-1"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Deletar usuário"], "isController": false}, {"data": [0.5, 500, 1500, "JDBC Request"], "isController": false}, {"data": [1.0, 500, 1500, "Consultar usuários válidos"], "isController": false}, {"data": [0.0, 500, 1500, "Erro de login"], "isController": false}, {"data": [0.5, 500, 1500, "Tela de login"], "isController": false}, {"data": [1.0, 500, 1500, "Consultar usuários cadastrados"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar Login 2"], "isController": false}, {"data": [1.0, 500, 1500, "Cadastro de usuário"], "isController": false}, {"data": [1.0, 500, 1500, "Login usuário com sucesso"], "isController": false}, {"data": [1.0, 500, 1500, "Conta cadastrada com sucesso"], "isController": false}, {"data": [0.9852037577074971, 500, 1500, "Login usuário com sucesso - Teste de pico"], "isController": false}, {"data": [1.0, 500, 1500, "Criar nova conta"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar Logout-0"], "isController": false}, {"data": [0.5, 500, 1500, "Formulário de cadastro"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Formulário de cadastro-0"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar login"], "isController": false}, {"data": [1.0, 500, 1500, "Formulário de cadastro-1"], "isController": false}, {"data": [0.5, 500, 1500, "Capturar token"], "isController": false}, {"data": [0.981160033869602, 500, 1500, "Consultar usuários válidos - teste de pico"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100135, 1329, 1.3272082688370699, 213.33765416687731, 0, 1340, 88.0, 130.0, 151.0, 177.0, 903.5579257013436, 855.045170212298, 222.55484251915217], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Realizar login-0", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 2.4398053278688523, 2.8624487704918034], "isController": false}, {"data": ["Realizar login-1", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 18.119315982972136, 2.231279024767802], "isController": false}, {"data": ["Excluir usuários", 100, 50, 50.0, 3.3800000000000012, 1, 25, 2.0, 7.700000000000017, 11.949999999999989, 24.89999999999995, 10.176045588684236, 5.0383350717411215, 2.255822606085275], "isController": false}, {"data": ["Login-0", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 1.610971715328467, 1.5129590556569341], "isController": false}, {"data": ["Realizar Login 2-0", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 1.446523246329527, 1.4242200244698207], "isController": false}, {"data": ["Login-1", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 8.710588727678571, 1.072474888392857], "isController": false}, {"data": ["Realizar Login 2-1", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 14.184984110169493, 1.7450438861985473], "isController": false}, {"data": ["Realizar Logout", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 6.1827184364548495, 2.121328908862876], "isController": false}, {"data": ["Deletar usuário", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 6.845535165847666, 1.578816031941032], "isController": false}, {"data": ["JDBC Request", 1, 0, 0.0, 802.0, 802, 802, 802.0, 802.0, 802.0, 802.0, 1.2468827930174564, 6.325738388403989, 0.0], "isController": false}, {"data": ["Consultar usuários válidos", 50, 0, 0.0, 118.78000000000002, 26, 197, 127.0, 174.9, 183.0, 197.0, 5.129257283545343, 29.99273088069348, 0.6211209991793188], "isController": false}, {"data": ["Erro de login", 1279, 1279, 100.0, 150.35965598123525, 11, 282, 144.0, 208.0, 227.0, 265.0, 48.461655046983935, 22.527097463246438, 12.132064759207335], "isController": false}, {"data": ["Tela de login", 1, 0, 0.0, 1340.0, 1340, 1340, 1340.0, 1340.0, 1340.0, 1340.0, 0.746268656716418, 2.1010669309701493, 0.3796933302238806], "isController": false}, {"data": ["Consultar usuários cadastrados", 50, 0, 0.0, 6.519999999999999, 3, 31, 5.0, 12.0, 17.04999999999996, 31.0, 5.086987486010784, 4.413160354563027, 0.6160023908841183], "isController": false}, {"data": ["Realizar Login 2", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 6.574188291910331, 1.5533625730994152], "isController": false}, {"data": ["Cadastro de usuário", 50, 0, 0.0, 228.50000000000003, 32, 370, 249.0, 350.2, 363.04999999999995, 370.0, 5.067396371744198, 2.4990577809871284, 1.4959706281037801], "isController": false}, {"data": ["Login usuário com sucesso", 1279, 0, 0.0, 135.18139171227514, 18, 266, 132.0, 185.0, 201.0, 247.60000000000014, 77.87858491140474, 53.90472774462644, 19.800617845399746], "isController": false}, {"data": ["Conta cadastrada com sucesso", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 9.004667207792208, 2.108487215909091], "isController": false}, {"data": ["Login usuário com sucesso - Teste de pico", 92929, 0, 0.0, 219.98924985741465, 0, 554, 89.0, 148.0, 164.0, 182.0, 931.787189668311, 645.3633334994034, 237.22518733016986], "isController": false}, {"data": ["Criar nova conta", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 11.797267587939698, 2.1346969221105527], "isController": false}, {"data": ["Login", 1, 0, 0.0, 1223.0, 1223, 1223, 1223.0, 1223.0, 1223.0, 1223.0, 0.8176614881439085, 5.508036079313164, 1.2672156071136549], "isController": false}, {"data": ["Realizar Logout-0", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 3.0408135775862073, 2.188846982758621], "isController": false}, {"data": ["Formulário de cadastro", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 3.2696630772646538, 1.5879981682948492], "isController": false}, {"data": ["Realizar Logout-1", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 9.200750612745098, 2.071206086601307], "isController": false}, {"data": ["Debug Sampler", 1965, 0, 0.0, 0.17353689567430072, 0, 12, 0.0, 1.0, 1.0, 1.0, 19.62076506006051, 43.7739369901347, 0.0], "isController": false}, {"data": ["Formulário de cadastro-0", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 1.0904750151883353, 1.2779560297691375], "isController": false}, {"data": ["Realizar login", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 10.487567070747218, 2.5337837837837838], "isController": false}, {"data": ["Formulário de cadastro-1", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 9.219138038079471, 2.4381725993377485], "isController": false}, {"data": ["Capturar token", 1, 0, 0.0, 1338.0, 1338, 1338, 1338.0, 1338.0, 1338.0, 1338.0, 0.7473841554559043, 2.2020097627055306, 0.3912088938714499], "isController": false}, {"data": ["Consultar usuários válidos - teste de pico", 2362, 0, 0.0, 218.4276037256559, 3, 553, 194.0, 423.0, 489.0, 527.3699999999999, 23.65477251559793, 237.87608409361764, 2.864445109310687], "isController": false}, {"data": ["HTTP Request", 50, 0, 0.0, 117.85999999999997, 23, 217, 124.5, 186.0, 193.89999999999998, 217.0, 5.113520147269381, 29.965827303640825, 0.6192153303334015], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 50, 3.762227238525207, 0.0499325910021471], "isController": false}, {"data": ["401/Unauthorized", 1279, 96.23777276147479, 1.2772756778349228], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100135, 1329, "401/Unauthorized", 1279, "400/Bad Request", 50, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Excluir usuários", 100, 50, "400/Bad Request", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Erro de login", 1279, 1279, "401/Unauthorized", 1279, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
