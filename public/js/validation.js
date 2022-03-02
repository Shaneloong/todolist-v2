const inputBar = document.getElementById('newAct');
const addBtn = document.getElementById('submitBtn');

window.onload = function(){
    if(inputBar.value.length === 0){
        addBtn.disabled = true;
    }
}

inputBar.addEventListener('keyup', ()=>{
    if(inputBar.value.length > 0 ){
        if(inputBar.value.trim() < 1){
            addBtn.disabled = true;
        }
        else{
            addBtn.disabled = false;
        }
        
    }
})