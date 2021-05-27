
function popup(title, content, id){
    const bg = document.createElement('div')
    const div = document.createElement('div')
    
    bg.classList.add('popup-background')

    bg.setAttribute('onclick', `closePopup('${id}')`)

    div.id = `${id}`
    bg.id = `${id}bg`

    div.classList.add('popup')
    div.innerHTML = `
        <h1>${title}</h1>
        <div>
            ${content}
        </div>
        <section class="popupnav">
            <a onclick="closePopup('${id}')">Zamknij</a>
        </section>
    `
    document.body.appendChild(bg)
    document.body.appendChild(div)
}
function closePopup(id){
    document.getElementById(id).remove()
    document.getElementById(id+'bg').remove()
}

async function popupSRC(title, source, id){
    const bg = document.createElement('div')
    const div = document.createElement('div')
    
    bg.classList.add('popup-background')

    const text = await fetch(source).then(res=>{return res.text()})

    bg.setAttribute('onclick', `closePopup('${id}')`)

    div.id = `${id}`
    bg.id = `${id}bg`

    div.classList.add('popup')
    div.innerHTML = `
        <h1>${title}</h1>
        <div>
            <span class="popupfile">
                ${text.replace(/\n/g, "<br>")}
            </span>
        </div>
        <section class="popupnav">
            <a onclick="closePopup('${id}')">Zamknij</a>
        </section>
    `
    document.body.appendChild(bg)
    document.body.appendChild(div)
}