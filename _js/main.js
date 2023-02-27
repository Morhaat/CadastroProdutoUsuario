function onlynumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    //var regex = /^[0-9.,]+$/;
    var regex = /^[0-9.]+$/;
    if( !regex.test(key) ) {
       theEvent.returnValue = false;
       if(theEvent.preventDefault) theEvent.preventDefault();
    }
 }


/*toLocaleString("pd-BR", {style:"currency", currency:"BRL"})

var ProdForm = "<h3>Cadastro de produtos</h3><br><br>"+
               "<label for='codBarra'>Código de Barra</label><br/>"+
               "<input type='text' id='codBarra'><br/>"+
               "<label for='nmProd'>Nome Produto</label><br>"+
               "<input type='text' id='nmProd'><br>"+
               "<label for='qtde'>Quantidade</label><br>"+
               "<input type='text' id='qtde'><br>"+
               "<label for='volume'>Volume</label><br>"+
               "<input type='text' id='volume'><br>"+
               "<label for='valor'>Valor</label><br>"+
               "<input type='text' id='valor' onkeypress= 'onlynumber()'><br>"+
               "<input type='submit' value='Salvar'>"
*/