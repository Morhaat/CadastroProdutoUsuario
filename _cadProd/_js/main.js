 var busca = document.getElementById("btBusca");
 var novo = document.getElementById("btNovo");
 var altera = document.getElementById("btAltera");
 var deleta = document.getElementById("btDeleta");
 var edBusca = document.getElementById("edBusca");
 var selectId = document.getElementById("prodId");
 var selectNm = document.getElementById("prodNome");
 var frameWarning = document.getElementById('frameWarningHidden');
 campos = {
    codbarra: {
        dado:document.getElementById("codBarra"),
        alteracao:false,
        original:""
    },
    nome_produto: {
        dado:document.getElementById("nmProd"),
        alteracao:false,
        original:""
    },
    quantidade: {
        dado:document.getElementById("qtde"),
        alteracao:false,
        original:""
    },
    volume: {
        dado:document.getElementById("volume"),
        alteracao:false,
        original:""
    },
    valor: {
        dado:document.getElementById("valor"),
        alteracao:false,
        original:""
    }
 }
 var idAtual = "";

 function alteraStatus(nome){
    for(const name in campos){
        console.log({[name]:campos[name]});
        if(name == nome){
            campos[name].alteracao = true;  
        }
    }
 }

 campos.codbarra.dado.addEventListener('keypress', ()=>{
    alteraStatus("codbarra");
 });
 campos.nome_produto.dado.addEventListener('keypress', ()=>{
    alteraStatus("nome_produto");
 });
 campos.quantidade.dado.addEventListener('keypress', ()=>{
    alteraStatus("quantidade");
 });
 campos.volume.dado.addEventListener('keypress', ()=>{
    alteraStatus("volume");
 });
 campos.valor.dado.addEventListener('keypress', ()=>{
    alteraStatus("valor");
 });

async function carregaDados(param){
    if(param != "00"){
        const response = await fetch("http://localhost/minhaapi/produtos/lista/"+param);
        var dadosApi = await response.json();
        console.log(dadosApi);
        if(dadosApi.status){
            dadosApi.dados.forEach(element => {
                idAtual = element.id_produto;
                campos.codbarra.dado.value = element.codbarra;
                campos.nome_produto.dado.value = element.nome_produto;
                campos.quantidade.dado.value = element.quantidade;
                campos.volume.dado.value = element.volume;
                campos.valor.dado.value = element.valor;
            })
        }
    }else{
        idAtual = "";
        campos.codbarra.dado.value = "";
        campos.nome_produto.dado.value = "";
        campos.quantidade.dado.value = "";
        campos.volume.dado.value = "";
        campos.valor.dado.value = "";
        selectNm.value = "00";
        selectId.value = "00";   
    }
}

selectId.addEventListener('change', ()=>{
    carregaDados(selectId.value)
    selectNm.value = "00";
});
 selectNm.addEventListener('change', ()=>{
    carregaDados(selectNm.value);
    selectId.value = "00";
 });


async function atualizaSelect(select){
    if(select == "id"){
        const response = await fetch("http://localhost/minhaapi/produtos/lista");
        var data = await response.json();
        let txtHtml = "<select name='prodId' id='prodId' class='inputs'>"+
                        "<option value='00'>Selecione uma opção</option>";
        if(data.status){
            data.dados.forEach(element => {
                txtHtml = txtHtml + 
                "<option value='"+element.id_produto+"'>"+element.id_produto+"</option>";
            })
        }
        selectId.innerHTML =  txtHtml + "</select>"; 
    }else if(select == "nome"){
        const response = await fetch("http://localhost/minhaapi/produtos/lista");
        var data = await response.json();
        let txtHtml = "<select name='prodNome' id='prodNome' class='inputs'>"+
                        "<option value='00'>Selecione uma opção</option>";
        if(data.status){
            data.dados.forEach(element => {
                txtHtml = txtHtml + 
                "<option value='"+element.nome_produto+"'>"+element.nome_produto+"</option>";
            })
        }
        selectNm.innerHTML =  txtHtml + "</select>";
    }
}

async function getapi(){
    var url;
    if(edBusca.value == ""){
        url = "http://localhost/minhaapi/produtos/lista";
    }else{
        url = "http://localhost/minhaapi/produtos/lista/"+edBusca.value;
    }    
    const response = await fetch(url);
    var data = await response.json();

    if (data.status){
        let tabela = document.getElementById('busca');
        let txtHtml = "<tr class='textLeft'>"+
                    "<th>Id do Produto</th>"+
                    "<th>Código de barra</th>"+
                    "<th>Nome do Produto</th>"+
                    "<th>Quantidade</th>"+
                    "<th>Volume</th>"+
                    "<th>Valor</th>"+
                  "</tr>";
        data.dados.forEach(element => {
            txtHtml = txtHtml + 
            "<tr>"+
            "<td class='textCenter'>"+element.id_produto+"</td>"+
            "<td class='textLeft'>"+element.codbarra+"</td>"+
            "<td class='textLeft'>"+element.nome_produto+"</td>"+
            "<td class='textCenter'>"+element.quantidade+"</td>"+
            "<td class='textCenter'>"+element.volume+"</td>"+
            "<td class='textCenter'>"+element.valor+"</td>"+
            "</tr>";
        });
        tabela.innerHTML = txtHtml;
    }else{
        console.log(data);
        let tabela = document.getElementById('busca');
        tabela.innerHTML = "<tabel></tabel>";
    }
 }

 async function postApi(){

    var texto = '{';
    var confirma;
    for (const Adata in campos){
        if(campos[Adata].alteracao && campos[Adata].dado.value != ""){
            texto = texto+'"'+Adata+'":"'+campos[Adata].dado.value+'",';
            confirma = campos[Adata].alteracao;
        }else{
            confirma = campos[Adata].alteracao;
            break;
        }
    }
    texto =texto.slice(0, texto.length-1);
    texto = texto + '}';

    if(confirma){
        var data = JSON.parse(texto);
        var formData = new FormData();
    
        for (const name in data){
            formData.append(name, data[name]);       
        }

        var request = new XMLHttpRequest();
        request.open("POST", "http://localhost/minhaapi/produtos/adiciona");
        request.onload = function(){
            var dados = JSON.parse(this.response);
        
            if(dados.status){
                console.log(dados.dados);
                atualizaSelect("id");
                atualizaSelect("nome");
            }else{
                console.log(dados.dados);   
            }
            carregaDados("00");
        }
        request.send(formData);
    }else{
        console.log({
            erro:"Não foi possível gravar dados!",
            dados:campos
        });
        carregaDados("00");
    }
 }


 async function updateApi(param){
    var texto = '{"_method":"PUT"';
    var confirma;
    for (const Adata in campos){
        if(campos[Adata].alteracao){
            texto = texto+',"'+Adata+'":"'+campos[Adata].dado.value+'"';
            confirma = campos[Adata].alteracao;
        }
    }
    texto = texto + '}';

    if(confirma){
        var data = JSON.parse(texto);
        var formData = new FormData();
    
        for (const name in data){
            formData.append(name, data[name]);       
        }

        var request = new XMLHttpRequest();
        request.open("POST", "http://localhost/minhaapi/produtos/update/"+param);
        request.onload = function(){
        var dados = JSON.parse(this.response);
        
            if(dados.status){
                console.log(dados.dados);
                atualizaSelect("id");
                atualizaSelect("nome");
            }else{
                console.log(dados.dados);   
            }
            frameWarning.setAttribute('id', 'frameWarningHidden');
            carregaDados("00");
        }
        request.send(formData);
    }else{
        console.log({
            erro:"Não foi possível realizar a alteração dos dados!",
            dados:campos
        });
        frameWarning.setAttribute('id', 'frameWarningHidden');
        carregaDados("00");
    }
}



 async function deleteApi(param = ''){
    data = {
        "_method" : "DELETE"
    }

    var formData = new FormData();
    
    for (const name in data){
        formData.append(name, data[name]);       
    }

    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost/minhaapi/produtos/delete/"+param);
    request.onload = function(){
       var dados = JSON.parse(this.response);
        
        if(dados.status){
            console.log(dados.dados);
            atualizaSelect("id");
            atualizaSelect("nome");
        }else{
            console.log(dados.dados);   
        }
        frameWarning.setAttribute('id', 'frameWarningHidden'); 
        carregaDados("00");
    }
    request.send(formData);
 }


 
 busca.addEventListener('click', getapi);
 novo.addEventListener('click', postApi);
 altera.addEventListener('click', ()=>{
    frameWarning.setAttribute('id', 'frameWarningShow');
    let txtHtml = "<div id='mDiv'>"+
                  "<h3>Você está prestes a alterar as informações exibidas nos campos, do banco de dados!</h3>"+
                  "<br>"+
                  "<p>Deseja continuar?</p>"+
                  "<br>"+
                  "<input type='button' name='btSim' id='btSim' value='Sim' onClick='alteraBt(`sim`)'>"+
                  "<input type='button' name='btNao' id='btNao' value='Não' onClick='alteraBt(`nao`)'>"+
                  "</di>";
    let mDiv = document.createElement("div");
    mDiv.innerHTML = txtHtml;
    frameWarning.appendChild(mDiv);
 });
 deleta.addEventListener('click', ()=>{
    frameWarning.setAttribute('id', 'frameWarningShow');
    let txtHtml = "<div id='mDiv'>"+
                  "<h3>Você está prestes a deletar as informações exibidas nos campos, do banco de dados!</h3>"+
                  "<br>"+
                  "<p>Deseja continuar?</p>"+
                  "<br>"+
                  "<input type='button' name='btSim' id='btSim' value='Sim' onClick='deletaBt(`sim`)'>"+
                  "<input type='button' name='btNao' id='btNao' value='Não' onClick='deletaBt(`nao`)'>"+
                  "</di>";
    let mDiv = document.createElement("div");
    mDiv.innerHTML = txtHtml;
    frameWarning.appendChild(mDiv);
 });



function deletaBt(botao){
    if(botao == 'sim'){
        deleteApi(idAtual);
    }else{
        frameWarning.setAttribute('id', 'frameWarningHidden');   
    }

    for (let index = frameWarning.childNodes.length-1; index >= 0; index--) {
        const element = frameWarning.childNodes[index];
        frameWarning.removeChild(element);
    }
}

function alteraBt(botao){
    if(botao == 'sim'){
        updateApi(idAtual);
    }else{
        frameWarning.setAttribute('id', 'frameWarningHidden');   
    }

    for (let index = frameWarning.childNodes.length-1; index >= 0; index--) {
        const element = frameWarning.childNodes[index];
        frameWarning.removeChild(element);
    }
}
        
 atualizaSelect("id");
 atualizaSelect("nome");