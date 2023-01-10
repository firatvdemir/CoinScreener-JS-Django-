# README
>Note: To Run, type `python manage.py runserver` on the file directory, and if you are using VS Code, be sure install Django's last version. (`python -m pip install Django`)

## An introduction to `CoinScreener`
According to last researchs, people's interest on cryptocurrencies is increasing. Unlike stock market, there are lots of different ecosystems, and every ecosystem has their various currencies. Sometimes it can be annoying and difficult to track this different ecosystems and their currencies. For instance, let's say I have some `ATLAS` (Star Atlas) token in my portfolio. This token is in only gate.io exchange right now. In addition to that, I have some `OKB` in Okx exchange and `SHIB` in my metamask hot wallet. Problem is: *How can I see my net worth or profit/loss situation?*, my main goal on `CoinScreener` is that you can search diffent ecosystem assets, and see their detailed page which contains technical graphics provided by *tradingview.com* and comments other people's comments on this asset, and finally you can add your position on this token to your portfolio. *(All functions will be explain in the below)*

### **Distinctiveness**
One of my main goal about this project is that this project should have differed from other CS50W projects in terms of it's subject and usefulness. I did not want to go with like e-commerce or social media web-application. Because, like we all know; social media or e-commerce web apps are valuable as long as their number of users(network size) are big. I wanted the create a product that is useful even there is zero user inside. You can now use my `CoinScreener` app for get info about assets and you can see their technical graphic to analyze, and you can add transaction to your portfolio. Like I said before, e-commerce, e-mail or social media apps do not have any value unless they have big number of users inside. `CoinScreener` app differs from this apps about this usefulness. Even I can use `CoinScreener` right now for track my portfolio.

### **Complexity**
This project designed as SPA(Single Page Application). Core of te project is `index.html`. All DOM manipulations is done by `coinscreener.js`. İndex.html has only 86 lines only.(even has lots of line breaks.). I believe this is show us the power and complexity of the SPA approach. In the Asset's detail page. I added a *modal window* for adding transaction. When user clicks Add transaction button in asset's detail page, this modal window opens and background goes blurred. I think adding modal window is a nice touch here. After user added a transaction(price, quantity, type), This modal takes user to the portfolio page(SPA, same route) while adding the transaction to the database. As a result, user routed to the updated portfolio less than 0.1 second. According to this, Search mechanism is also important, it helps user to search in *CoinGecko.com* database, and writes the results. I also added comment section, when a user adds a comment, page does not reload, Javascript manipulate the DOM and add user's comment to the page in under 1 second. Styling this project was also a challenge for me. Because of SPA approach, giving every element an id or class name was very important for CSS selection. I pondered about UI and UX. When user enters the home page, If price or change perc. went down in last 24h, it's text color will be red. In the opposite sitution, text color will be green. I wanted the add this little touchs for improve UI and UX.

### **Homepage** *(In NavBar)*
When a user clicks on Home button, `mainpage()` function is started in `coinscreener.js`.

This function writes Top30 Coins'/Tokens':
- *Global rank*
- *Name and logo*
- *Price*
- *24h low and high price($)*
- *24h price change($)*
- *Marketcap*
- *Volume(24h)*
- *Circulating Supply*

Rows are clickable and when user clicks a row of asset, `asset_detail()` function in `coinscreener.js` will redirect user to the asset's detail page. All informations about coins are from `CoinGecko.com` API service. After user's click, asset's **id** sends to API and function renders informations from API's respond about that coin.

### **Asset's detail page**
This page contains **four** different area and sub-areas of that main areas.
1.  **Header area**
    - *Back to Home Page button*
    - *Asset's name, symbol and rank*
    - *Asset's category(ies)*
    - *Asset's contract address if exists*
    - *Platforms that asset's belong*
    - *Add transaction button*
        When this button is clicked, a modal window opens for adding transaction (explained end of the list)
2.  **Technical graphic area from `tradingview.com`**
3.  **Description area**

    This area contains official description of asset that owner the project's provides.
4.  **Comments area**
    - *Other user's comments lists*
    - *Add a comment textarea*
    - *Comment type selection(*Bullish/Bearish*)*

###### **Add transaction modal window**
This modal window's main goal is that provide a tracking system for user. After user make transaction in CEX or DEX, comes this page and writes price, quantity and transaction type (Buy/Sell) of his/her transaction. After that point, user does not need go to cex or dex to check the price. `Portfolio()` function (*will explain in below*) checks last price and keeps profit/loss situation and quantity etc.

### **Portfolio** *(In NavBar)*
In this portfolio page user can see all of its portfolio, regardless of the exchange. It does not matter that asset's exchange listing situation. If asset is in the `CoinGecko.com`, user can add his or her portfolio. portfolio function takes last price from API, compares with your average buying price and tells your profit/loss situation.

### **Search Bar** *(In NavBar)*
User can search asset on this bar. Results will be listed as clickable rows.

## Files explained
### `models.py`
this model contains three main model. you can see models and contents below.
1. `User`
2. `Portfolio`
    - *username*
    - *asset_name*
    - *asset_id*
    - *asset_symbol*
    - *quantity*
    - *price*
    - *total_spent*
    - *date*
    - *type*
3. `Comments`
    - *username*
    - *asset_id*
    - *comment*
    - *date*
    - *type*

### `views.py`
`views.py` contains back-end functions for `CoinScreener` app. I want to make a list of these functions.
-  *index*

    this function is the first function when user enter the site. Renders `index.html`, and then `coinscreener.js` opens the landing page.
-  *portfolio*

    `portfolio` takes logged username as input and make some back-end query processes with this data and find logged user's assets and other necessary informations.
-  *add_transaction*

     this function takes datas from add transaction modal window and process this datas *(asset_name, asset_id, logged user etc.)* for portfolio model.
-  *comment_process*

    this function process all comments. there are two sub-function on this function. `query_comments` and `add_comment`. one for query comments for spesific asset from comments model. and one for add a comment to the comment model.
-  *login_view*
-  *logout_view*
-  *register*

### `coinscreener.js`
`coinscreener.js` contains various front-end and back-end functions for `CoinScreener` app. In the below, all functions have been declared as list.
- `mainpage()`
- `searh()`
- `asset_detail()`
- `query_comments()`
- `add_comment()`
- `add_transaction()`
- `portfolio()`
- `modal_area()`
- `modal_process()`

#### `mainpage()`
`mainpage()` renders the main page on `index.html`. First of all, function `fetch` a request to the coingecko API to get information about top30 coins. After gathering information, `mainpage()` renders a table and process the informations from coingecko like price, name, symbol, supply etc.

#### `Search()`
`Search()` listens search bar input from user. If user types something and clicks search, `Search()` will get this value and `fetch` a request to the coingecko API and process the respond to create a result table.

#### `asset_detail()`
`asset_detail()`'s main purpose is that renders asset's all details like technical graphic, comments, description, and add transaction button for the user's transactions. this function takes `asset_id` as input, and `fetch` a request to the coingecko API. after that, define variables from API's JSON respond. (`asset_name`, `asset_price`, `asset_thumb` etc.). Continue with tradingview.com widget, modal window and commments. I added one time usage listener for comment form if user does not write a comment, this listener will be removed.

#### `query_comments() and add_comment()`
These functions takes `asset_id` as input argument, and fetch a request to the `commment_process` from `views.py`. in view.py if sub-function is add_comment, there no return and `commment_process` will add comment to the `Comments` model. if sub-function is query_comments, `commment_process` return Jsonresponse for Javascript to rendering process.

#### `add_transaction()`
`add_transaction()` takes `asset_name`, `asset_id`, `asset_symbol` as input. In addition to that, this function listens to modal window. If user types price, quantity and transaction_type(*buy/sell*) to the modal window, `add_transaction()` takes that infos too and `fetch` a request to the `add_transaction` from views.py. After that `add_transaction` will handle the model process on the portfolio model, and redirects user to the portfolio route.

#### `modal_area()` and `modal_process()`
`modal_area()` creates the whole modal window dynamically on index.html, and `modal_process()` handles the modal window's front-end processes.






