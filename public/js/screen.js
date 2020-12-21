window.onload = () =>{

    let doc = document;
    let winheight = window.innerHeight;
    const headerHeight = 43;

    let divider = doc.querySelector(".divider");

    const divHeight = winheight - headerHeight;
    console.log(divHeight, winheight)

    divider.style.height = divHeight+"px";
    
}