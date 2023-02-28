let form = document.getElementById('form');
let submitBtn = document.getElementById('submit-btn');
let liContaner = document.getElementById('list-container');
console.log(liContaner);

window.addEventListener("load",function(){
    refresh();
})

submitBtn.addEventListener('click',function(event){
    event.preventDefault();
    let taskName = document.getElementById('task-name');
    taskName.value = taskName.value.trim();
    let taskImg = document.getElementById('task-img');
    if(taskName.value == "" || taskImg.value == ""){
        alert("Task should not be emtpy");
    }else{
        let formData =new FormData(form);
        let request = new XMLHttpRequest;
        request.open("POST","/submittask");
        request.send(formData);
        request.addEventListener('load',function(){
            console.log(request.status);
            switch(request.status){
                case 303:{
                    alert("UserName Image is Empty");
                    break;
                }
                case 404:{
                    alert("Server Time out");
                    break;
                }
                case 200:{
                    console.log("File is Uploaded");
                    taskImg.value = "";
                    taskName.value = "";
                    refresh();
                }
            }
        })
    }
});


function checkbox(element){
    window.event.preventDefault();
    console.log(element);
    let check = element.getElementsByTagName('input')[0];
    console.log(check);
    let status = check.checked;
    console.log(status);
    let request = new XMLHttpRequest;
    request.open('PUT','/checkbox');
    let obj = {"id" : element.id};
    request.setRequestHeader('Content-Type','application/JSON');
    request.send(JSON.stringify(obj));
    request.addEventListener('load',function(){
        console.log(request.status);
        if(request.status == 200){
            if(status){
                check.checked = true;
            }else{
                check.checked = false;
            }
        }else{
        }
    })
}


function refresh(){
    let getRequest = new XMLHttpRequest;
    getRequest.open('GET','/getList');
    getRequest.send();
    getRequest.addEventListener("load",function(){
        let data = getRequest.response;
        liContaner.innerHTML=data;
    })
}

function del(element){
    console.log(element);
    let request = new XMLHttpRequest;
    request.open("DELETE",'/delList');
    request.setRequestHeader("Content-Type",'application/JSON');
    let obj = {"id":element.id};
    request.send(JSON.stringify(obj));
    request.addEventListener('load',function(){
        if(request.status == 200){
            element.remove();
        }else{
            alert('Error Occure');
        }
    })
}