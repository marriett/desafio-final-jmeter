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

    var data = {"OkPercent": 98.86550730603005, "KoPercent": 1.1344926939699527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9875231529121218, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Realizar login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar login-1"], "isController": false}, {"data": [0.5, 500, 1500, "Excluir usuários"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar Login 2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar Login 2-1"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar Logout"], "isController": false}, {"data": [0.5, 500, 1500, "Deletar usuário"], "isController": false}, {"data": [0.5, 500, 1500, "JDBC Request"], "isController": false}, {"data": [1.0, 500, 1500, "Consultar usuários válidos"], "isController": false}, {"data": [0.0, 500, 1500, "Erro de login"], "isController": false}, {"data": [0.5, 500, 1500, "Tela de login"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar Login 2"], "isController": false}, {"data": [1.0, 500, 1500, "Login usuário com sucesso"], "isController": false}, {"data": [1.0, 500, 1500, "Conta cadastrada com sucesso"], "isController": false}, {"data": [0.9989081762397037, 500, 1500, "Login usuário com sucesso - Teste de pico"], "isController": false}, {"data": [1.0, 500, 1500, "Criar nova conta"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar Logout-0"], "isController": false}, {"data": [0.5, 500, 1500, "Formulário de cadastro"], "isController": false}, {"data": [1.0, 500, 1500, "Realizar Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Formulário de cadastro-0"], "isController": false}, {"data": [0.5, 500, 1500, "Realizar login"], "isController": false}, {"data": [1.0, 500, 1500, "Formulário de cadastro-1"], "isController": false}, {"data": [0.5, 500, 1500, "Capturar token"], "isController": false}, {"data": [0.9971489665003563, 500, 1500, "Consultar usuários válidos - teste de pico"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 116616, 1323, 1.1344926939699527, 182.06210983055428, 0, 1287, 140.0, 292.0, 306.0, 332.0, 1055.7210237097256, 996.0536039727823, 259.7229063029033], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Realizar login-0", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 2.601866166077739, 3.0849712897526507], "isController": false}, {"data": ["Realizar login-1", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 18.499060522151897, 2.280706091772152], "isController": false}, {"data": ["Excluir usuários", 100, 50, 50.0, 1.370000000000001, 0, 4, 1.0, 2.0, 3.0, 3.989999999999995, 10.209290454313425, 5.05479517611026, 2.263192317508933], "isController": false}, {"data": ["Login-0", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 1.9069220430107525, 1.7830141129032258], "isController": false}, {"data": ["Realizar Login 2-0", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 1.7023346303501945, 1.6985347762645915], "isController": false}, {"data": ["Login-1", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 15.695689510723861, 1.9321799597855227], "isController": false}, {"data": ["Realizar Login 2-1", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 14.62158203125, 1.8017578125], "isController": false}, {"data": ["Realizar Logout", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 5.89358578821656, 2.0199915406050954], "isController": false}, {"data": ["Deletar usuário", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 5.545549525948104, 1.2825910678642714], "isController": false}, {"data": ["JDBC Request", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 9.091831877240143, 0.0], "isController": false}, {"data": ["Consultar usuários válidos", 50, 0, 0.0, 96.05999999999999, 3, 247, 86.5, 191.2, 224.84999999999985, 247.0, 5.097359567743909, 29.676488906871242, 0.617258385156489], "isController": false}, {"data": ["Erro de login", 1273, 1273, 100.0, 96.61272584446192, 4, 279, 92.0, 137.60000000000014, 162.0, 235.26, 63.85433386837881, 29.682288009129213, 15.985234782554173], "isController": false}, {"data": ["Tela de login", 1, 0, 0.0, 1276.0, 1276, 1276, 1276.0, 1276.0, 1276.0, 1276.0, 0.7836990595611285, 2.2072149294670846, 0.39873750979623823], "isController": false}, {"data": ["Realizar Login 2", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 7.356272223741794, 1.7437089715536105], "isController": false}, {"data": ["Login usuário com sucesso", 1273, 0, 0.0, 106.33857030636288, 2, 279, 99.0, 170.0, 194.0, 243.26, 87.41931053426727, 60.50804587711166, 22.225950891017717], "isController": false}, {"data": ["Conta cadastrada com sucesso", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 7.845603813559323, 1.8345030014124295], "isController": false}, {"data": ["Login usuário com sucesso - Teste de pico", 108534, 0, 0.0, 188.40823152191805, 0, 627, 144.0, 294.0, 307.0, 329.0, 1087.1664396185593, 753.0136664753036, 276.79774482067376], "isController": false}, {"data": ["Criar nova conta", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 16.239997837370243, 2.9398248269896197], "isController": false}, {"data": ["Login", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 8.025251116071429, 1.845005580357143], "isController": false}, {"data": ["Realizar Logout-0", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 2.557798873546512, 1.845248909883721], "isController": false}, {"data": ["Formulário de cadastro", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 4.629127916141235, 2.25483724779319], "isController": false}, {"data": ["Realizar Logout-1", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 9.934116417253522, 2.231651628521127], "isController": false}, {"data": ["Debug Sampler", 2409, 0, 0.0, 0.107513491075135, 0, 4, 0.0, 1.0, 1.0, 1.0, 24.073389361340674, 52.638435338991094, 0.0], "isController": false}, {"data": ["Formulário de cadastro-0", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 1.762810654527559, 2.0703893946850394], "isController": false}, {"data": ["Realizar login", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 10.988366026711185, 2.6606844741235394], "isController": false}, {"data": ["Formulário de cadastro-1", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 9.738212719298247, 2.583607456140351], "isController": false}, {"data": ["Capturar token", 1, 0, 0.0, 1287.0, 1287, 1287, 1287.0, 1287.0, 1287.0, 1287.0, 0.777000777000777, 2.2915452602952606, 0.40671134421134425], "isController": false}, {"data": ["Consultar usuários válidos - teste de pico", 2806, 0, 0.0, 175.5819672131144, 1, 624, 167.5, 308.0, 388.0, 489.0, 28.08387129059701, 273.5514347351499, 3.400781289095731], "isController": false}, {"data": ["HTTP Request", 150, 0, 0.0, 97.37333333333333, 3, 449, 62.5, 249.9, 348.34999999999974, 438.2900000000002, 1.366954334612195, 3.2939149743012583, 0.24486815440660512], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 50, 3.7792894935752077, 0.042875763188584756], "isController": false}, {"data": ["401/Unauthorized", 1273, 96.2207105064248, 1.091616930781368], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 116616, 1323, "401/Unauthorized", 1273, "400/Bad Request", 50, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Excluir usuários", 100, 50, "400/Bad Request", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Erro de login", 1273, 1273, "401/Unauthorized", 1273, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
