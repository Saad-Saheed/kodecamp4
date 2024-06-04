const getCountries = async () =>{
    const search = document.querySelector('#search').value.trim();
    const region = document.querySelector('#filter').value.trim();
    
    const url = '../data.json';
    const container = document.querySelector('#country-cont');

    try {
        container.innerHTML = '<h3 align="center">Loading...</h3>';
        const res = await fetch(url, {method: "GET"});
        let data = await res.json();
    
        if(res.status == 200){
            if(search && region){
                data = data.filter((country, index, countries) => country.name.toLowerCase().includes(search.toLowerCase()) && country.region.toLowerCase() === region.toLowerCase());
            }else if(search){
                data = data.filter((country, index, countries) => country.name.toLowerCase().includes(search.toLowerCase()));
            }else if(region){
                data = data.filter((country, index, countries) => country.region.toLowerCase() === region.toLowerCase());
            }

            container.innerHTML = '';
            data.map((country, index, countries)=>{
                // populate coutries DOM
                container.innerHTML +=`<div class="country-card">
                    <a href="./detail.html?code=${country.alpha3Code}">
                        <div class="card-head">
                            <img src="${country.flags.png}" alt="${country.name} logo">
                        </div>

                        <div class="card-body">
                            <h2 class="title">${country.name}</h2>
                            <p><span>Population:</span> ${ new Intl.NumberFormat('en-us').format(country.population)}</p>
                            <p><span>Region:</span> ${country.region}</p>
                            <p><span>Capital:</span> ${country.capital}</p>
                        </div>
                    </a>
                </div>`;
            });

        }else{
            container.innerHTML ='<h3 align="center">No Record Found</h3>';
        }
    } catch (error) {
        container.innerHTML ='<h3 align="center">No Record Found</h3>';
    }
}

const getCountry = async () =>{
    const code = new URLSearchParams(window.location.search).get('code');
    const url = '../data.json';
    const container = document.querySelector('#country-card');

    

    try {
        
        if(!code)
            new Error('No Record Found');

        container.innerHTML = '<h3 align="center">Loading...</h3>';
        const res = await fetch(url, {method: "GET"});
        let data = await res.json();
    
        if(res.status == 200){
            const country = data.find((country, index, countries) => country.alpha3Code.toLowerCase() === (code.toLowerCase()));
            if(!country)
                new Error('No Record Found');
    
            //get border countries
            const borderCountries = data.filter((cntry, index, cntries) => country.borders?.includes(cntry.alpha3Code.toUpperCase()));
            const borderCountriesDOM = borderCountries.map((borderCountry, index) => (`<a href="./detail.html?code=${borderCountry.alpha3Code}" class="b-countries">${borderCountry.name}</a>`)).join(' ');


            container.innerHTML = '';
                // populate country DOM
                container.innerHTML +=`<img class="card-img" src="${country.flags.svg}" alt="${country.flags.png} logo">
                <div class="card-body">
                    <h2 class="title">${country.name}</h2>
                    <div class="desc-1">
                        <p><span>Native Name:</span> ${country.nativeName}</p>
                        <p><span>Population:</span> ${ new Intl.NumberFormat('en-us').format(country.population)}</p>
                        <p><span>Region:</span> ${country.region}</p>
                        <p><span>Sub Region:</span> ${country.subregion}</p>
                        <p><span>Capital:</span> ${country.capital}</p>
                    </div>
            
                    <div class="desc-2">
                        <p><span>Top Level Domain:</span> ${country.topLevelDomain}</p>
                        <p><span>Currencies:</span> ${country.currencies.map((curr, i, allCurr) => ((i+1) < allCurr.length) ? ` ${curr.name}` : ` ${curr.name}`) }</p>
                        <p><span>Languages:</span> ${country.languages.map((lang, i, allLang) => ((i+1) < allLang.length) ? ` ${lang.name}` : ` ${lang.name}`) }</p>
                    </div>
            
                    <div class="desc-3">
                        <p><span>Border Countries:</span>${ borderCountriesDOM }</p>
                    </div>
                </div>`;

        }else{
            container.innerHTML ='<h3 align="center">No Record FoundB</h3>';
        }
    } catch (error) {
        console.error(error.message);
        container.innerHTML ='<h3 align="center">No Record Found</h3>';
    }
};

const getCurrentTheme = () => {
    let theme = window.matchMedia('prefers-color-scheme: dark').matches ? "dark" : "light";
    localStorage.getItem('currentTheme') ? theme = localStorage.getItem('currentTheme') : null;
    return theme;
}

const loadTheme = (theme) => {
    const root = document.querySelector(':root');
    theme === "dark" ? themeText.innerText = "Dark Mode" : themeText.innerText = "Light Mode";
    root.setAttribute('color-scheme', theme);
}

const changeTheme = () => {
    let theme = getCurrentTheme();  
    // change theme
    if(theme === "light"){
        theme = "dark";
    }else{
        theme = "light";
    }
    localStorage.setItem('currentTheme', theme);
    loadTheme(theme);
}

