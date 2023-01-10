document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#landing-page').style.display = 'block';
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#asset-detail').style.display = 'none';
    document.querySelector('#portfolio-page').style.display = 'none';
    document.querySelector('#home-button').addEventListener('click', mainpage);
    document.querySelector('#search-button').addEventListener('click', Search);
    document.querySelector('#portfolio-button').addEventListener('click', Portfolio);
    // mainpage();
});

function mainpage() {
    document.querySelector('#main-page').style.display = 'block';
    document.querySelector('#landing-page').style.display = 'none';
    document.querySelector('#asset-detail').style.display = 'none';
    document.querySelector('#portfolio-page').style.display = 'none';

    document.querySelector('#main-page').innerHTML = '';
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#main-page').innerHTML = '';
    // document.querySelector('#asset-detail').innerHTML = '';
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false', {
        method: "GET",
    })
    .then(response => response.json())
    .then(results => {
        // create a table for top20 list
        let table = document.querySelector('#main-page').appendChild(document.createElement('table'));
        table.setAttribute("class", "table table-striped -sm");
        let thead = table.appendChild(document.createElement('thead')).appendChild(document.createElement('tr'));
        let tbody = table.appendChild(document.createElement('tbody'));
        /* in the below, I want to automated table processing.
        First for loop creates tables headers, second for loops creates the top30 list */
        // headers loop
        let headers = ["#", "Name", "Price", "Low (24H)", "High(24H)", "Change($)", "Marketcap", "Volume(24h)", "Circulating Supply"]
        for(let i=0; i<9; i++) {
            let th = thead.appendChild(document.createElement('th'))
            th.innerHTML = headers[i];
            th.setAttribute("scope", "col");
        };
        // top30 list loop
        for( let i=0; i<results.length; i++) {
            let rank = results[i].market_cap_rank;
            let name = results[i].name;
            let symbol = results[i].symbol;
            let img = results[i].image;
            let price = results[i].current_price;
            let low_24h = results[i].low_24h;
            let high_24h = results[i].high_24h;
            let price_change_24h =  new Intl.NumberFormat({ maximumSignificantDigits: 4 }).format(results[i].price_change_24h);
            let marketcap = new Intl.NumberFormat().format(results[i].market_cap);
            let volume = new Intl.NumberFormat().format(results[i].total_volume);
            let circulating_supply = new Intl.NumberFormat().format(results[i].circulating_supply);

            // add this variables to an array to use in for loop
            let variables = [rank, name, price, low_24h, high_24h, price_change_24h, marketcap, volume, circulating_supply];
            // this "element" represents a row on top30 rows
            element = tbody.appendChild(document.createElement('tr'));
            for(let j=0; j<9; j++) {
                row = element.appendChild(document.createElement('td'));
                row.innerHTML = variables[j];

                if (j == 1) {
                    // console.log(results)
                    row.innerHTML = `<img src=${img} style="margin-right:6px; height:30px;"></img>` + row.innerHTML  ;
                };
                /* this if statement will change text color,
                according to asset's price change(green or red)  */
                if (j == 5 && variables[j][0] == "-") {
                    row.style.cssText = "color: red;";
                } else if( j == 5 && variables[j][0] != "-" ) {
                    row.style.cssText = 'color: #33cc33;';
                };
                row.addEventListener('click', () => asset_detail(results[i].id))
            };
        };
    });
};

function Search() {
    document.querySelector('#search-results').style.display = 'block';
    document.querySelector('#asset-detail').style.display = 'none';
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#portfolio-page').style.display = 'none';
    document.querySelector('#landing-page').style.display = 'none';

    document.querySelector('#search-results').innerHTML='';

    let value = document.querySelector('#search-form').value ;
    fetch(`https://api.coingecko.com/api/v3/search?query=${value}`, {
        method:"GET",
    })
    .then(response => response.json())
    .then(results => {
        for(let i=0; i < results.coins.length/2 ; i++) {
            let asset_symbol = results.coins[i].symbol;
            let asset_name = results.coins[i].name;
            let asset_market_cap_rank = results.coins[i].market_cap_rank;
            let asset_id = results.coins[i].id;

            // define an area("element") for each search result
            let element = document.querySelector('#search-results').appendChild(document.createElement('div'));

            // write asset informations inside the "element"
            let assetname_area =  element.appendChild(document.createElement('h1'));
            assetname_area.setAttribute("class", "assetname");
            assetname_area.addEventListener('click', () => asset_detail(asset_id));
            assetname_area.innerHTML = `${asset_name} (${asset_symbol}) #${asset_market_cap_rank}` ;
            document.querySelector('#search-form').value = '';
        };
    });
};

function asset_detail(asset_id) {
    document.querySelector('#asset-detail').style.display = 'block';
    document.querySelector('#search-results').style.display = 'none';
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#portfolio-page').style.display = 'none';
    document.querySelector('#back-to-main-page').addEventListener('click', mainpage);

    document.querySelector('#asset-header-area').innerHTML ='';
    document.querySelector('#asset-description-area').innerHTML ='';
    document.querySelector('#modal-area').innerHTML =''
    fetch(`https://api.coingecko.com/api/v3/coins/${asset_id}`, {
        method: "GET",
    })
    .then(response => response.json())
    .then(results => {
        let asset_name = results.name;
        let asset_symbol = results.symbol;
        let asset_rank = results.coingecko_rank;
        let asset_base = results.tickers[1].base;
        let asset_target = results.tickers[1].target;
        let asset_price = results.tickers[1].last;
        let asset_desciption = results.description.en;
        let asset_thumb = results.image.small;

        new TradingView.widget(
            {
            "width": "device-width", "height": 610,
             "symbol": `GATEIO:${asset_symbol}USDT`,
             "interval": "240", "timezone": "America/New_York", "theme": "light", "style": "1",
            "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "hide_top_toolbar": true, "allow_symbol_change": true,
            "save_image": false, "studies": [ "RSI@tv-basicstudies"],"container_id": "tradingview_17093"
            } );
        let asset_header_area = document.querySelector('#asset-header-area');
        asset_header_area.appendChild(document.createElement('h2')).innerHTML = `${asset_name} (${asset_symbol}) #${asset_rank}`;
        asset_header_area.appendChild(document.createElement('h6')).innerHTML = `Categories: ${results.categories}`;
        asset_header_area.appendChild(document.createElement('h6')).innerHTML = `Contract Address: ${results.contract_address}`;
        asset_header_area.appendChild(document.createElement('h6')).innerHTML = `Platforms: ${Object.keys(results.detail_platforms)}`;

        let asset_description_area = document.querySelector('#asset-description-area');
        asset_description_area.appendChild(document.createElement('h3')).innerHTML = "Description";
        asset_description_area.appendChild(document.createElement('hr'));
        asset_description_area.appendChild(document.createElement('p')).innerHTML = asset_desciption;

        // modal area func below
        modal_process(asset_name, asset_id, asset_symbol, asset_price);

        // query to comment database for inital printing
        query_comments(asset_id);

        // listen for comment adding process
        let comment_form = document.querySelector('#postform'); /* define comment form */
        let comment_event = function() { /* comment add listening function */
            add_comment(asset_id);
        };
        comment_form.addEventListener('submit', comment_event , { once: true });

        /* this func. remove event listener on comment section when user clicks any button to exit asset_detail */
        const inputs_buttons = document.querySelectorAll("button, a");
        for( let i=0; i<inputs_buttons.length; i++) {
            inputs_buttons[i].addEventListener('click', function() {
                comment_form.removeEventListener('submit', comment_event , { once: true });
            });
        };
    });
};

function query_comments(asset_id) {
    document.querySelector('#all-comments').innerHTML = '';
    fetch('comment_process',{
        method:'POST',
        body: JSON.stringify({
            asset_id: asset_id,
            function: "query_comments",
        })
    })
    .then(response => response.json())
    .then(results => {
        for(let i=0; i<results.length; i++){
            let username = results[i].username;
            let comment_value = results[i].comment;
            let comment_date = results[i].date;
            let comment_type = results[i].type;

            let asset_comment_area = document.querySelector('#all-comments');
            let comment_bubble = asset_comment_area.appendChild(document.createElement('div'));
            comment_bubble.setAttribute("class", "comment_bubble");

            comment_bubble.appendChild(document.createElement('h4')).innerHTML = `${username} feels ${comment_type}`;
            comment_bubble.appendChild(document.createElement('hr'));
            comment_bubble.appendChild(document.createElement('p')).innerHTML = comment_value;
        };
    });
};

function add_comment(asset_id) {
    let comment_value = document.querySelector('#comment-content').value;
    let comment_type = document.querySelector('#comment-type').value;
    fetch('comment_process', {
        method:'POST',
        body: JSON.stringify({
            function: "add_comment",
            asset_id: asset_id,
            comment_value: comment_value,
            comment_type: comment_type,
        })
    });
    setTimeout(() => {
        query_comments(asset_id);
    }, 1000);

    document.querySelector('#comment-content').value = '';
};


function add_transaction(asset_name, asset_id, asset_symbol) {
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector('#quantity').value;
    let transaction_type = document.querySelector('#transaction-type').value;

    fetch('add_transaction', {
        method: 'POST',
        body: JSON.stringify({
            asset_name: asset_name,
            asset_id: asset_id,
            asset_symbol: asset_symbol,
            price: price,
            quantity: quantity,
            transaction_type: transaction_type,
        })
    });
    setTimeout(Portfolio, 1200); /* wait 1.2 second and redirect user to the portfolio page */
};

function Portfolio() {
    document.querySelector('#portfolio-page').style.display = 'block';
    document.querySelector('#asset-detail').style.display = 'none';
    document.querySelector('#search-results').style.display = 'none';
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#landing-page').style.display = 'none';

    document.querySelector('#table-body').innerHTML ='';

    fetch('portfolio', {
        method: "POST"
    })
    .then(response => response.json())
    .then(results => {
        let portfolio = results.portfolio;
        for(const [asset_name, values] of Object.entries(portfolio)) {
            let body_tr = document.querySelector('#table-body').appendChild(document.createElement('tr'));
            // assign portfolio table values via for loop
            let row_data = [asset_name, values.quantity, values.avg_price, values.current_price, values.change_24h, values.profit_loss];
            for( let i=0; i<row_data.length; i++) {
                let body_td = body_tr.appendChild(document.createElement('td'));
                body_td.innerHTML = row_data[i];

                // this if statement will change text color, according to asset's change perc. or profit/loss situation(green or red)
                if ((i == 4 || i == 5) && (row_data[i] > 0)) {
                    body_td.style.cssText= 'color: #33cc33;';
                } else if ((i == 4 || i == 5) && (row_data[i] < 0)) {
                    body_td.style.cssText= 'color: red;';
                };
            };
        };
    });
};

// this function creates whole modal transaction window
function modal_area() {
    document.querySelector('#modal-area').innerHTML = '';
    let modal_area = document.querySelector('#modal-area');
    let section_child = modal_area.appendChild(document.createElement('section'));
    section_child.setAttribute("class", "modal hidden");

    let first_div_child = section_child.appendChild(document.createElement('div'));
    first_div_child.setAttribute("class", "flex");

    let close_button = first_div_child.appendChild(document.createElement('button'));
    close_button.setAttribute("class", "btn-close");
    close_button.innerHTML = "⨉"

    let second_div_child = section_child.appendChild(document.createElement('div'));
    let h3 = second_div_child.appendChild(document.createElement('h3'));
    h3.setAttribute("class", "modal-heading");
    h3.innerHTML = "Transaction Page";
    second_div_child.appendChild(document.createElement('p')).innerHTML = "Add this token to your portfolio, or remove. Type in your transaction's buy or sell price and quantity.";

    let form_area = section_child.appendChild(document.createElement('form'));
    form_area.setAttribute("action", "javascript:void(0);");
    form_area.setAttribute("id", "transaction-form");
    form_area.setAttribute("method", "POST");

    let first_h4 = form_area.appendChild(document.createElement('h4'));
    first_h4.setAttribute("class", "modal-heading");
    first_h4.innerHTML = "Price:";

    let input = form_area.appendChild(document.createElement('input'));
    input.setAttribute("type", "number");
    input.setAttribute("step", "0.00001");
    input.setAttribute("id", "price");
    input.setAttribute("placeholder", "Price");
    input.setAttribute("required", "");

    let second_h4 = form_area.appendChild(document.createElement('h4'));
    second_h4.setAttribute("class", "modal-heading");
    second_h4.innerHTML = "Quantity:";

    let input_2 = form_area.appendChild(document.createElement('input'));
    input_2.setAttribute("type", "number");
    input_2.setAttribute("step", "0.0001");
    input_2.setAttribute("id", "quantity");
    input_2.setAttribute("placeholder", "Quantity");
    input_2.setAttribute("required", "");
    form_area.appendChild(document.createElement('br'));

    let third_h4 = form_area.appendChild(document.createElement('h4'));
    third_h4.setAttribute("class", "modal-heading");
    third_h4.innerHTML = "Transaction Type:";

    let select = form_area.appendChild(document.createElement('select'));
    select.setAttribute("class", "form-select");
    select.setAttribute("id", "transaction-type");
    select.setAttribute("style", "margin-left:5%;");
    select.setAttribute("required", "");

    let option_1 = select.appendChild(document.createElement('option'));
    option_1.setAttribute("selected", "");
    option_1.setAttribute("value", " ");
    option_1.innerHTML = "Open Select Menu";
    let option_2 = select.appendChild(document.createElement('option'));
    option_2.setAttribute("value", "Buy");
    option_2.innerHTML = "Buy";
    let option_3 = select.appendChild(document.createElement('option'));
    option_3.setAttribute("value", "Sell");
    option_3.innerHTML = "Sell";
    form_area.appendChild(document.createElement('br'));

    let input_3 = form_area.appendChild(document.createElement('input'));
    input_3.setAttribute("type", "submit");
    input_3.setAttribute("value", "Apply");
    input_3.setAttribute("class", "btn btn-primary");
    input_3.setAttribute("id", "apply-transaction");

    let third_div = modal_area.appendChild(document.createElement('div'));
    third_div.setAttribute("class", "overlay hidden");
};

function modal_process(asset_name, asset_id, asset_symbol, asset_price) {
    modal_area();

    const openModalBtn = document.querySelector(".btn-open");
    const closeModalBtn = document.querySelector(".btn-close");
    const transaction_form = document.querySelector('#transaction-form');
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    let add_function = function() { /* create a global transaction func. variable for add/remove listener */
        add_transaction(asset_name, asset_id, asset_symbol);
    };

    let openModal = function () {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");

        // prefill the modal price row with current price
        let modal_price_area = document.querySelector('#price');
        modal_price_area.setAttribute("placeholder", asset_price);
        // add a listener for user's buy or sell transaction
        transaction_form.addEventListener('submit', add_function , { once: true });
        };

    let closeModal = function () {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
        // if user does not submit any transaction and decides to close modal window, remove the listener added before
        transaction_form.removeEventListener('submit', add_function , { once: true });
        };

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
};