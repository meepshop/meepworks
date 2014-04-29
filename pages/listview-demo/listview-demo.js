var core = require('meepworks-core');
var listview = require('meepworks-listview');
var pagination = require('meepworks-pagination');
var meepApp = require('meepworks-app');
var meepPanel = require('meepworks-panel');

var names = ["Zulma",
"Melisa",
"Emery",
"Zora",
"Nicolette",
"Shery",
"Adrianne",
"Lyla",
"Estefana",
"Cornelia",
"Tinisha",
"Jessi",
"Lashay",
"Mia",
"Joie",
"Una",
"Werner",
"Elena",
"Florine",
"Sau",
"Terica",
"Melvina",
"Deirdre",
"Darlena",
"Jaclyn",
"Ronnie",
"Eddie",
"Charmain",
"Morgan",
"Inell",
"Lloyd",
"Lynell",
"Dot",
"Nu",
"Xiomara",
"Aleen",
"Georgene",
"Janine",
"Magnolia",
"Macy",
"Augusta",
"Loralee",
"Cinthia",
"Hyman",
"Jannette",
"Lorelei",
"Isis",
"Natisha",
"Tiffiny",
"Latrice"];

var jobs = ["Auto Parts Salesperson",
"CFEI",
"Cork Insulator Helper",
"Water Colorist",
"Ferry Engineer",
"Train Clerk",
"Blockmason",
"Cat Breeder",
"Penal Officer",
"Irradiated Fuel Handler",
"Individual Pension Adviser",
"Silk Screen Operator",
"Submarine Special Purpose Acoustic Equipment Maintenance Technician",
"Neurology Technician",
"Switch Coupler",
"Pewterer",
"Digital Proofing and Platemaker",
"Bus Person",
"Biochemical Engineer",
"Health Actuary",
"Manufacturing Engineering Professor",
"Deck Hand",
"Pantograph Engraver",
"Aoc Operations - Special Operations Officer",
"Cat Breeder"];



var queryFn = function (param, cb)
{
    /* use param to query stuff... */
    
    cb(data);
}
var genDb = function (count)
{
    var db = [];
    for(var i = 0; i<count; i++)
    {
        db.push({
            name: names[Math.floor(Math.random() * 50)],
            job: jobs[Math.floor(Math.random()*25)]
        })
        
    }
    return db;
}
var count = 55;
var db = genDb(55);


var listviewDemo = module.exports = core.createClass({
    queryFn: function (params, cb)
    {
        console.log(params);
        var items = [];
        if(params.filter != '')
        {
            //filter data;
        }
        else
        {
            items = db.slice(0, db.length);
        }
        if(params.sort != '')
        {
            var sort = params.sort.split(':');
            var order = sort[1] == 'asc' ? 1 : -1;
            items.sort(function (a, b)
            {
                if(a[sort[0]]==b[sort[0]])
                {
                    return 0;
                }
                else
                {
                    return a[sort[0]] > b[sort[0]] ? order : -order;
                }
            })
        }
        var from = params.page * params.step;
        
        if (params.step != -1)
        {
            if (params.step == 0)
            {
                params.step = 10;
            }
            items = items.slice(from, from + params.step);
        }
        setTimeout(function ()
        {
            cb({
                page: params.page,
                count: db.length,
                step: params.step,
                sort: params.sort,
                items: items
            });
        }, Math.random()*70 + 120);
        
        
    },
    render: function ()
    {
        return meepApp({
            body: meepApp.body({
                content: [
				meepPanel({
				    title: 'Basic Listview',
				    canExpand: true,
				    body: [
						'Listview is a component for display a table of data:',
                        listview.extended({
                            ref: 'listview',
                            selectable: true,
                            queryFn: this.queryFn,
                            columns: [
                                {
                                    fieldname: 'name',
                                    label: 'Name',
                                    canSort: true
                                },
                                {
                                    fieldname: 'job',
                                    label: 'Job',
                                    canSort: true
                                }
                            ]
                        })
				    ]
				})
                ]
            })
        });
    }
});
