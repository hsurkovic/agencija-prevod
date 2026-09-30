document.addEventListener("DOMContentLoaded",()=>{
  const header=document.querySelector(".site-header");
  const menu=document.getElementById("menuToggle");
  const panel=document.getElementById("navPanel");
  const preloader=document.getElementById("preloader");

  window.addEventListener("load",()=>setTimeout(()=>preloader?.classList.add("hide"),250));
  window.addEventListener("scroll",()=>header?.classList.toggle("scrolled",window.scrollY>25),{passive:true});

  menu?.addEventListener("click",()=>{
    const open=panel.classList.toggle("open");
    menu.setAttribute("aria-expanded",String(open));
  });
  panel?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>panel.classList.remove("open")));

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}})
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));

  const form=document.getElementById("quoteForm");
  const msg=document.getElementById("formMessage");
  form?.addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(form);
    const file=document.getElementById("fileInput")?.files?.[0];
    if(file && file.size>10*1024*1024){
      msg.textContent="Datoteka je veća od 10 MB. Molimo odaberite manju datoteku.";
      msg.className="form-message err"; return;
    }
    const subject=encodeURIComponent(`Zahtjev za procjenu prevoda – ${data.get("name")}`);
    const body=encodeURIComponent(
      `Ime i prezime: ${data.get("name")}\n`+
      `E-mail: ${data.get("email")}\n`+
      `Telefon: ${data.get("phone")||"-"}\n`+
      `Ciljni jezik: ${data.get("language")}\n`+
      `Detalji dokumenta: ${data.get("message")}\n`+
      `Dokument: ${file?file.name:"nije priložen"}\n\n`+
      `Napomena: mailto forma ne može automatski priložiti datoteku.`
    );
    window.location.href=`mailto:the32systemba@gmail.com?subject=${subject}&body=${body}`;
    msg.textContent="Otvaram vaš e-mail program sa pripremljenim upitom.";
    msg.className="form-message ok";
  });
});
