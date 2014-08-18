//Created by Hasan Altan Birler @ hasan.birler.co

var dEngine = {
    cDia: "start",
    dialogues: {},
    variables: {},
    developer: false,
    jsonpath: "json/",
    defaultjson: "dialogue.json",
    setup: function(stuff) {
        dEngine.cDia = "start";
        
        if (stuff != undefined) {
            dEngine.parse(stuff);
        } else
        {
            $.get(dEngine.jsonpath+dEngine.defaultjson, function(data) {
                dEngine.parse(data);
                
                if (dEngine.dialogues["prestate"] != undefined)
                {
                    var preState = dEngine.dialogues["prestate"];
                    for (var variable in preState) {
                        if (variable != "include")
                            dEngine.varCommand(variable, "= "+preState[variable]);
                    }
                }
                
                var includes = dEngine.dialogues["prestate"]["include"];
                if (includes == undefined)
                {
                    dEngine.update();
                }
                else
                {
                    var donec = 0;
                    for (inc in includes)
                    {
                        var url = dEngine.jsonpath + includes[inc];
                        $.get(url, function(data2) {
                            dEngine.addparse(data2);

                            donec++;
                            if (donec == includes.length)
                            {
                                dEngine.update();
                            }
                        });
                    }
                }
                
            });
        }
    },
    parse: function(data) {
        dEngine.dialogues = JSON.parse(data);

        if (dEngine.developer)
        {
            function replaceAll(find, replace, str) {
                return str.replace(new RegExp(find, 'g'), replace);
            }

            data = replaceAll("\n", "<br/>", data);
            data = replaceAll(" ", "&nbsp;", data);
            data = replaceAll("\t", "&#09;", data);

            document.getElementById("json").innerHTML = replaceAll("\n", "<br/>", data);
        }
    },
    addparse: function(data) {
        jQuery.extend(dEngine.dialogues,JSON.parse(data));
        
        if (dEngine.developer)
        {
            data = JSON.stringify(dEngine.dialogues);
            function replaceAll(find, replace, str) {
                return str.replace(new RegExp(find, 'g'), replace);
            }

            data = replaceAll("\n", "<br/>", data);
            data = replaceAll(" ", "&nbsp;", data);
            data = replaceAll("\t", "&#09;", data);

            document.getElementById("json").innerHTML = replaceAll("\n", "<br/>", data);
        }
    },
    variableUpdated: function(variable)
    {
        if (dEngine.developer)
        {
            var varlist = document.getElementById("variables");

            var text = "";
            for (var varia in dEngine.variables)
            {
                text += varia+"&#09;: " + dEngine.variables[varia].toString() + "<br/>";
            }

            varlist.innerHTML = text;
        }
        
        if (variable == "title")
        {
            window.document.title = dEngine.getVariable(variable);
        }
        
        
        if (variable == "signal")
        {
        }
    },
    getVariable:function(variable)
    {
        if (dEngine.variables[variable] == undefined)
            dEngine.variables[variable] = 0;
        return dEngine.variables[variable];
    },
    varCommand:function(variable,command)
    {
                
        var commandArr = command.split(' ');

        var commandOperator = commandArr[0];
        var commandNumberS = commandArr[1];
        var commandNumber;
        if (isNaN(commandNumberS))
        {
            if (commandNumberS[0] == "*")
                commandNumber = dEngine.variables[commandNumberS.substr(1)];
            else
                commandNumber = commandNumberS;
        }
        else
            commandNumber = parseFloat(commandNumberS);

        if (dEngine.variables[variable] == undefined)
        {
            dEngine.variables[variable] = 0;
        }
        
        var commandbool = commandNumber==1 || commandNumber=="1" || commandNumber == "true";
        var variablebool = dEngine.variables[variable]==1 || dEngine.variables[variable]=="1" || dEngine.variables[variable]=="true";

        switch(commandOperator)
        {
                case "=":
                    dEngine.variables[variable] = commandNumber;
                    break;
                case "-":
                    dEngine.variables[variable] -= commandNumber;
                    break;
                case "+":
                    dEngine.variables[variable] += commandNumber;
                    break;
                case "/":
                    dEngine.variables[variable] /= commandNumber;
                    break;
                case "*":
                    dEngine.variables[variable] *= commandNumber;
                    break;
                case "%":
                    dEngine.variables[variable] %= commandNumber;
                    break;
                case "|":
                    dEngine.variables[variable] = variablebool || commandNumber;
                    break;
                case "&":
                    dEngine.variables[variable] = variablebool && commandbool;
                    break;
                case "=!":
                    dEngine.variables[variable] = !commandbool;
                    break;
        }

        dEngine.variableUpdated(variable);
    },
    select: function(index) {
        var cd = dEngine.dialogues[dEngine.cDia];
        var cur = cd.op[index];

        if (cur.e != undefined) {
            if (cur.e instanceof Array)
            {
                for (var index in cur.e)
                {
                    var esplit = cur.e[index].split(' ');
                    dEngine.varCommand(esplit[0],esplit[1]+' '+esplit[2]);
                }
            }
            else
            for (var variable in cur.e) {
                dEngine.varCommand(variable,cur.e[variable]);

            }
        }
        if (cur.pX != undefined)
        {
            var rand = Math.random();
            var cRand = 0;
            for (var a in cur.pX)
            {
                cRand += cur.pX[a];
                if (rand < cRand)
                {
                    dEngine.update(a);
                    return;
                }
            }
        }
        dEngine.update(cur.p);
    },
    doC:function(command,variable){

        




        var state = true;

        var commandArr = command.split(' ');

        var commandOperator = commandArr[0];
        var commandNumberS = commandArr[1];
        var commandNumber;

        if (isNaN(commandNumberS))
        {
            if (commandNumberS[0] == "*")
                commandNumber = dEngine.variables[commandNumberS.substr(1)];
            else
                commandNumber = commandNumberS;
        }
        else
            commandNumber = parseFloat(commandNumberS);


        if (dEngine.variables[variable] == undefined)
        {
            dEngine.variables[variable] = 0;
        }

        switch(commandOperator)
        {
                case "=":
                    state = dEngine.variables[variable] == commandNumber;
                    break;
                case "==":
                    state = dEngine.variables[variable] == commandNumber;
                    break;
                case "!=":
                    state = dEngine.variables[variable] != commandNumber;
                    break;
                case "<":
                    state = dEngine.variables[variable] < commandNumber;
                    break;
                case ">":
                    state = dEngine.variables[variable] > commandNumber;
                    break;
                case "<=":
                    state = dEngine.variables[variable] <= commandNumber;
                    break;
                case ">=":
                    state = dEngine.variables[variable] >= commandNumber;
                    break;
        }

        disabled = !state;
        return disabled;
    },
    update: function(to) {
        if (to !== undefined)
            dEngine.cDia = to.trim();
        
        if (to === "")
            return;
        
        if (dEngine.cDia[0] == "*")
        {
            dEngine.cDia = dEngine.variables[dEngine.cDia.substr(1)];
        }
        
        dEngine.variables["state"] = dEngine.cDia;
        if (dEngine.developer)
        {
            document.getElementById("state").innerHTML = dEngine.cDia;
        }
        
            
        var img = document.getElementById("image");
        var q = document.getElementById("text");
        var b = document.getElementById("buttons");
        var cd = dEngine.dialogues[dEngine.cDia];
        
        var text = cd.t;
        text = text.replace(/(?:^|\W)\*(\w+)(?!\w)/g, function (match, capture) {return " "+dEngine.getVariable(capture);});
        
        var imgsrc = cd.img;
        if (imgsrc != undefined)
        {
            imgsrc = imgsrc.replace(/(?:^|\W)\*(\w+)(?!\w)/g, function (match, capture) {return " "+dEngine.getVariable(capture);}).trim();
            img.src = "images/" + imgsrc + dEngine.getVariable("imageFormat");
        }
        else
        {
            img.src = "";
        }
        
        q.innerHTML = text;
        var buttext = "";
        for (var i in cd.op) {
            var cancel = false;
            var disabled = false;
            var curop = cd.op[i];
            if (curop.cX != undefined)
            {
                eval("foo=function(){"+curop.cX+"}");
                disabled = !foo.apply(dEngine.variables);
            }
            else if (curop.c != undefined) {
                for (var vari in curop.c) {
                    var command, variable;
                    if (curop.c instanceof Array)
                    {
                        var varisplit = curop.c[vari].split(' ');
                        variable = varisplit[0];
                        command = varisplit[1] + ' ' + varisplit[2];
                    }
                    else
                    {
                        variable = vari;
                        command = curop.c[variable];
                    }
                    
                    disabled = dEngine.doC(command,variable);
                    if(disabled)
                        break;
                }
            }
            
            var hidden = false;
            if (curop.hX != undefined)
            {
                eval("foo=function(){"+curop.hX+"}");
                hidden = !foo.apply(dEngine.variables);
            }
            else
            if (curop.h != undefined) {
                
                for (var vari in curop.h) {
                    var command, variable;
                    if (curop.h instanceof Array)
                    {
                        var varisplit = curop.c[vari].split(' ');
                        variable = varisplit[0];
                        command = varisplit[1] + ' ' + varisplit[2];
                    }
                    else
                    {
                        variable = vari;
                        command = curop.h[variable];
                    }
                    
                    hidden = dEngine.doC(command,variable);
                    if (hidden)
                        break;
                }
            }

            if (hidden)
                continue;
            //if (!dEngine.developer && cancel)
            //    continue;
            
            var text = curop.t;
            text = text.replace(/(?:^|\W)\*(\w+)(?!\w)/g, function (match, capture) {
                return " "+dEngine.getVariable(capture);});
            
            disabled = disabled | curop.disabled;
            
            buttext += '<button ' + (cancel||disabled==1?"disabled":"") + ' onclick="dEngine.select(' + "'" + i + "'" + ');">' + text + '</button>';
        }

        b.innerHTML = buttext;
    }
}

function v(variable)
{
    console.log(dEngine.variables[variable]);
}