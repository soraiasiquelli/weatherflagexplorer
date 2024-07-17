var btnprocurar = document.getElementById("btnprocurar");
var secao_previsao = document.getElementById("previsao")
var secao_navegacao = document.getElementById("navigationsection")
var p_temp = document.getElementById("temp");
var p_temp_feels = document.getElementById("temp_feels");
var p_country = document.getElementById("country");
var p_weather = document.getElementById("weather")

btnprocurar.addEventListener("click", async function(e){
    e.preventDefault();
    const cityname = document.getElementById("cityname").value;
    console.log(cityname);

    if(cityname == ''){
        window.alert("Digite uma cidade para consultar.")
    }else{

    const apiKey = '42f160bb61658f395571c5103eb8ba81';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`;

    getTempo(url);
    secao_previsao.style.display = "block"
    secao_navegacao.style.display = "none"
    }

});

async function getTempo(url){
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Erro na busca dos dados da API');
        }
        const data = await response.json();
        if (data && data.main && data.main.temp) {

            const countryCode = data.sys.country; // Obtém o código do país dos dados meteorológicos
            await getBandeira(countryCode); // Espera a função buscar a bandeira

            const temperaturaKelvin = data.main.temp;
            const temperaturaKelvinSensacao = data.main.feels_like;
            const temperaturaCelsius = temperaturaKelvin - 273.15;
            const temperaturaCelcisuSensacao = temperaturaKelvinSensacao - 273.15;

            p_temp.style.display = "block";
            p_temp_feels.style.display = "block";
            p_weather.style.display = "block";
            p_country.style.display = "block";

            console.log('Temperatura:', temperaturaCelsius.toFixed(2));
            p_temp.innerHTML = temperaturaCelsius.toFixed(2) + '<span class="small-font">°C</span>';
            p_temp_feels.innerHTML = 'Sensação Térmica: ' + temperaturaCelcisuSensacao.toFixed(2);
            p_weather.innerHTML = data.weather[0].main;
            p_country.innerHTML = "País: " + data.sys.country;

            console.log('País:',  data.sys.country);
        } else {
            console.error('Dados de temperatura não encontrados na resposta da API');
        }
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

/* FUNÇÃO PARA BUSCAR BANDEIRAS */

async function getBandeira(countryCode){
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if(!response.ok){
            throw new Error("Erro ao buscar dados das bandeiras");
        }
        const data = await response.json();
        let bandeiraUrl = "";

                //Verifica se o dado na posicao zero(o primeiro) possui as propriedades
                if (data[0] && data[0].flags && data[0].flags.png) {
                    bandeiraUrl = data[0].flags.png; // Verifica se a chave 'flags' e 'png' existem
                } else if (data[0] && data[0].flag) {
                    bandeiraUrl = data[0].flag; // Caso contrário, tenta obter 'flag'
                } else {
                    throw new Error("URL da bandeira não encontrada");
                }

        const imagem = document.getElementById("bandeira");
        imagem.style.display = "block"
        imagem.src = bandeiraUrl; // Define a URL da bandeira na imagem
    } catch (error) {
        console.error("Erro ao buscar bandeiras:", error.message);
    }
}
