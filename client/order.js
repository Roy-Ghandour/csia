
//Order Info:
let order = {
    length    : null,
    connA     : null,
    connB     : null,
    colorA    : null,
    colorB    : null,
    wrap      : null,
    aviator   : null,
    coil      : null
};

let total;

//Loaded Options
let connector;
let thread;
let wrap;


let length = [
    {length: 0.5, price: 15},
    {length: 1,   price: 20},
    {length: 1.5, price: 25},   //prices not final
    {length: 2,   price: 30},
    {length: 2.5, price: 35},
    {length: 3,   price: 40}
];

length.map(  (obj) => {obj.name = obj.length + "m"});

let coil = [
    {length: 0, price: 0},
    {length: 5, price: 7},
    {length: 7,   price: 10},
    {length: 10, price: 15},
    {length: 12,   price: 18},
    {length: 15, price: 24},
];

coil.map(  (obj) => {obj.name = obj.length + "cm"});


let aviator = [
    {name: "No",  addon: 0, price: 0},   //layout not final
    {name: "Yes", addon: 1,  price: 30}
];

async function importOptions() {

    //Filling option objects
    connector = await get("SELECT * FROM connectors");
    thread = await get("SELECT * FROM threads INNER JOIN colors ON threads.colors_id = colors.id");
    wrap = await get("SELECT wraps.id, wraps.name, wraps.price, wraps.stock, colors.hex FROM wraps INNER JOIN colors ON wraps.colors_id = colors.id");

    //Updating drop down menus
    fillOption('length', length);
    update('length', 0);

    fillOption('connA', connector);
    update('connA', 0);
    fillOption('connB', connector);
    update('connB', 0);

    fillOption('colorA', thread);
    update('colorA', 0);
    fillOption('colorB', thread);
    update('colorB', 0);
    fillOption('wrap', wrap);
    update('wrap', 0);

    fillOption('coil', coil);
    update('coil', 0);

    //can this just be replaced wiht a boolean?
    fillOption('aviator', aviator);
    update('aviator', 0);

    pricelist();
}

function fillOption(id, options) {
    let list = document.getElementById(id);
    for (let i = 0; i < options.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = options[i].name;
        list.appendChild(opt);
    }
}

$(function () {
    $("select").on("change", function () {
        let option = $(this).attr("name");
        let value = $(this).children("option:selected").val();

        update(option, value);

        pricelist();
        $(this).blur();
    });
});

//need to implement stock shortage noticies and disable the submit button
function update(option, value) {
    order[option] = select(option, value);
    userprompt(option);
}

function select(option, value) {
    switch (option) {
        case 'length' :
            return length[value];
        case 'connA' :
        case 'connB' :
            return connector[value];
        case 'colorA' :
        case 'colorB' :
            return thread[value];
        case 'wrap':
            return wrap[value];
        case 'coil':
            return coil[value];
        case 'aviator':
            return aviator[value];
    }
}

function userprompt(option) {
    let price = order[option].price;

    let addtext = "#" + option + "text";
    $(addtext).text("+ " + price + "$");
}

function pricelist() {
    let names = [];
    let price = [];

    total = 0;

    //Base cable + length
    names[0] = order.length.name + " Cable";
    price[0] = order.length.price;

    //Connectors
    names[1] = order.connA.name + " to " + order.connB.name;
    price[1] = order.connA.price + order.connB.price;

    //Colors
    names[2] = order.colorA.name + " thread";
    price[2] = order.colorA.price;
    names[3] = order.colorB.name + " thread";
    price[3] = order.colorB.price;
    names[4] = order.wrap.name + " heatshrink";
    price[4] = order.wrap.price;

    let n = 4;

    //Coil
    if (order.coil.length != 0) {
        n++;
        names[n] = order.coil.name + " coil";
        price[n] = order.coil.price;
    }

    //Aviator
    if (order.aviator.addon == true) {
        n++;
        names[n] = "Aviator Connector";
        price[n] = order.aviator.price;
    }

    $('table tr').css("display", "none");
    for (let i = 0; i < names.length;  i++) {
        $('table tr:nth-child(' + (i+1) +') td:nth-child(1)').text("- " + names[i]);
        $('table tr:nth-child(' + (i+1) + ') td:nth-child(2)').text(price[i] + "$");
        $('table tr:nth-child(' + (i+1) +')').css("display", "table-row");

        total += price[i];
    }

    let vat = Math.round(total * 5) / 100;
    let shipping = 12;

    total = total + vat + shipping;

    $('.tally span:nth-child(1)').text("VAT: " + vat + "$");
    $('.tally span:nth-child(2)').text("Shipping: " + shipping + "$");
    $('.tally span:nth-child(3)').text("Total: " + total + "$");
}


//Placing the order and sending the query
async function place() {

    let date = new Date();
    date.setHours(date.getHours() + 4); //Adjusting for time zone
    let formatted = date.toISOString().slice(0, 19).replace('T', ' ');

    let user = sessionStorage.getItem('user');

    let val = "('0', '" +
        order.length.length + "', '" +
        order.connA.id + "', '" +
        order.connB.id + "', '" +
        order.colorA.id + "', '" +
        order.colorB.id + "', '" +
        order.wrap.id + "', '" +
        order.coil.length + "', '" +
        order.aviator.addon + "', '" +
        user + "', '" +
        formatted + "', '" +
        formatted + "');";

    let sql = "INSERT INTO orders (`status`,`length`, `connA`,`connB`,`colorA`,`colorB`,`wrap`,`coil`,`aviator`,`customers_id`,`placed`,`updated`) VALUES ";
    sql += val;

    await get(sql);
    location.replace('purchases.html');
}
