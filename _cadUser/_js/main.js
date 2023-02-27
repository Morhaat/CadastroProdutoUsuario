 var busca = document.getElementById("btBusca");
 var novo = document.getElementById("btNovo");
 var altera = document.getElementById("btAltera");
 var deleta = document.getElementById("btDeleta");
 var edBusca = document.getElementById("edBusca");
 var selectId = document.getElementById("userId");
 var selectNm = document.getElementById("userNome");
 var frameWarning = document.getElementById('frameWarningHidden');
 campos = {
    nome: {
        dado:document.getElementById("nomeUser"),
        alteracao:false,
        original:""
    },
    sobrenome: {
        dado:document.getElementById("sbrnmUser"),
        alteracao:false,
        original:""
    },
    usuario: {
        dado:document.getElementById("user"),
        alteracao:false,
        original:""
    },
    senha: {
        dado:document.getElementById("senha"),
        alteracao:false,
        original:""
    },
    email: {
        dado:document.getElementById("e-mail"),
        alteracao:false,
        original:""
    }
 }
 var idAtual = "";

 function alteraStatus(nome){
    for(const name in campos){
        if(name == nome){
            campos[name].alteracao = true;  
        }
    }
 }

 campos.nome.dado.addEventListener('keypress', ()=>{
    alteraStatus("nome");
 });
 campos.sobrenome.dado.addEventListener('keypress', ()=>{
    alteraStatus("sobrenome");
 });
 campos.usuario.dado.addEventListener('keypress', ()=>{
    alteraStatus("usuario");
 });
 campos.senha.dado.addEventListener('keypress', ()=>{
    alteraStatus("senha");
 });
 campos.email.dado.addEventListener('keypress', ()=>{
    alteraStatus("email");
 });

async function carregaDados(param){
    if(param != "00"){
        const response = await fetch("http://localhost/minhaapi/usuarios/lista/"+param);
        var dadosApi = await response.json();
        if(dadosApi.status){
            dadosApi.dados.forEach(element => {
                idAtual = element.id;
                campos.nome.dado.value = element.nome;
                campos.sobrenome.dado.value = element.sobrenome;
                campos.usuario.dado.value = element.usuario;
                campos.senha.dado.value = element.senha;
                campos.email.dado.value = element.email;
            })
        }
    }else{
        idAtual = "";
        campos.nome.dado.value = "";
        campos.sobrenome.dado.value = "";
        campos.usuario.dado.value = "";
        campos.senha.dado.value = "";
        campos.email.dado.value = "";
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

function asterisco(senha){
    var element="";
    for (let index = 0; index < senha.length; index++){
        element = element + "*";       
    }
    return element;
}

async function atualizaSelect(select){
    if(select == "id"){
        const response = await fetch("http://localhost/minhaapi/usuarios/lista");
        var data = await response.json();
        let txtHtml = "<select name='userId' id='userId' class='inputs'>"+
                        "<option value='00'>Selecione uma opção</option>";
        if(data.status){
            data.dados.forEach(element => {
                txtHtml = txtHtml + 
                "<option value='"+element.id+"'>"+element.id+"</option>";
            })
        }
        selectId.innerHTML =  txtHtml + "</select>"; 
    }else if(select == "nome"){
        const response = await fetch("http://localhost/minhaapi/usuarios/lista");
        var data = await response.json();
        let txtHtml = "<select name='userNome' id='userNome' class='inputs'>"+
                        "<option value='00'>Selecione uma opção</option>";
        if(data.status){
            data.dados.forEach(element => {
                txtHtml = txtHtml + 
                "<option value='"+element.email+"'>"+element.nome+" "+element.sobrenome+"</option>";
            })
        }
        selectNm.innerHTML =  txtHtml + "</select>";
    }
}

async function getapi(){
    var url;
    if(edBusca.value == ""){
        url = "http://localhost/minhaapi/usuarios/lista";
    }else{
        var busca = edBusca.value;
        for (let index = 0; index < busca.length; index++) {
            if(busca[index] === " "){
                busca = busca.slice(0, index)+","+busca.slice(index+1, busca.length);
                break;
            }
        }
        url = "http://localhost/minhaapi/usuarios/lista/"+busca;
    }    
    const response = await fetch(url);
    var data = await response.json();

    if (data.status){
        let tabela = document.getElementById('busca');
        let txtHtml = "<tr class='textLeft'>"+
                    "<th>Id do Usuário</th>"+
                    "<th>Nome</th>"+
                    "<th>Sobrenome</th>"+
                    "<th>Username</th>"+
                    "<th>Senha</th>"+
                    "<th>E-mail</th>"+
                  "</tr>";
        data.dados.forEach(element => {
            txtHtml = txtHtml + 
            "<tr>"+
            "<td class='textCenter'>"+element.id+"</td>"+
            "<td class='textLeft'>"+element.nome+"</td>"+
            "<td class='textLeft'>"+element.sobrenome+"</td>"+
            "<td class='textCenter'>"+element.usuario+"</td>"+
            "<td type='password' class='textCenter'>"+asterisco(element.senha)+"</td>"+
            "<td class='textCenter'>"+element.email+"</td>"+
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
        request.open("POST", "http://localhost/minhaapi/usuarios/adiciona");
        request.onload = function(){
            var dados = JSON.parse(this.response);
        
            if(dados.status){
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
        request.open("POST", "http://localhost/minhaapi/usuarios/update/"+param);
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
    request.open("POST", "http://localhost/minhaapi/usuarios/delete/"+param);
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