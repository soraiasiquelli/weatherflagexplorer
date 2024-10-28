var btnprocurar = document.getElementById("btnprocurar");
var secao_previsao = document.getElementById("previsao");
var secao_navegacao = document.getElementById("navigationsection");
var p_temp = document.getElementById("temp");
var p_temp_feels = document.getElementById("temp_feels");
var p_country = document.getElementById("country");
var p_weather = document.getElementById("weather");
var p_nomedacidade = document.getElementById("nomedacidade")
var temperaturaCelsius; // Variável global para armazenar a temperatura

btnprocurar.addEventListener("click", async function(e){
    e.preventDefault();
    const cityname = document.getElementById("cityname").value;
    console.log(cityname);

    if(cityname == ''){
        window.alert("Digite uma cidade para consultar.");
    } else {
        const apiKey = '42f160bb61658f395571c5103eb8ba81';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`;

        await getTempo(url);
        secao_previsao.style.display = "block";
        secao_navegacao.style.display = "none";
        gerarImagem(); // Agora a função poderá acessar temperaturaCelsius
        p_nomedacidade.innerHTML = "📍 " + cityname
    }
});

async function getTempo(url){
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro na busca dos dados da API');
        }
        const data = await response.json();
        if (data && data.main && data.main.temp) {

            const countryCode = data.sys.country;
            await getBandeira(countryCode);

            const temperaturaKelvin = data.main.temp;
            const temperaturaKelvinSensacao = data.main.feels_like;
            temperaturaCelsius = temperaturaKelvin - 273.15; // Armazena o valor em uma variável global
            const temperaturaCelsiusSensacao = parseInt(temperaturaKelvinSensacao - 273.15);

            p_temp.style.display = "block";
            p_temp_feels.style.display = "block";
            p_weather.style.display = "block";
            p_country.style.display = "block";

            console.log('Temperatura:', temperaturaCelsius.toFixed(2));
            p_temp.innerHTML = temperaturaCelsius.toFixed(0) + '<span class="small-font">°C</span>';
            p_temp_feels.innerHTML = 'Sensação Térmica: ' + temperaturaCelsiusSensacao + '<span class="small-font">°C</span>';
            p_weather.innerHTML = data.weather[0].main;
            p_country.innerHTML = "País: " + data.sys.country;

            console.log('País:', data.sys.country);
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
        if (!response.ok) {
            throw new Error("Erro ao buscar dados das bandeiras");
        }
        const data = await response.json();
        let bandeiraUrl = "";

        if (data[0] && data[0].flags && data[0].flags.png) {
            bandeiraUrl = data[0].flags.png;
        } else if (data[0] && data[0].flag) {
            bandeiraUrl = data[0].flag;
        } else {
            throw new Error("URL da bandeira não encontrada");
        }

        const imagem = document.getElementById("bandeira");
        imagem.style.display = "block";
        imagem.src = bandeiraUrl;
    } catch (error) {
        console.error("Erro ao buscar bandeiras:", error.message);
    }
}

/* Se estiver frio, vai aparecer uma imagem de neve, e se estiver calor, vai mostrar uma imagem de praia */

function gerarImagem() {
    if (temperaturaCelsius <= 18) {
        secao_previsao.style.backgroundImage = "url('neve.jpg')";
    } else {
        secao_previsao.style.backgroundImage = "url('praia.jpg')"; // 
        p_nomedacidade.style.color = "black"
    }
}

