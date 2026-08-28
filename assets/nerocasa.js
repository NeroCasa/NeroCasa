document.addEventListener('DOMContentLoaded',function(){
  var header=document.querySelector('[data-header]');
  function update(){if(header)header.classList.toggle('is-scrolled',window.scrollY>40)}
  window.addEventListener('scroll',update,{passive:true}); update();
  document.querySelectorAll('[data-nc-carousel-wrap]').forEach(function(wrap){
    var rail=wrap.querySelector('[data-nc-carousel]'),prev=wrap.querySelector('[data-nc-prev]'),next=wrap.querySelector('[data-nc-next]'),progress=wrap.querySelector('.ncs-rail-progress i');
    if(!rail)return;
    function step(){var item=rail.querySelector('.ncs-best-card,.ncs-related-rail>a');return item?item.getBoundingClientRect().width+18:rail.clientWidth}
    function updateRail(){var max=Math.max(1,rail.scrollWidth-rail.clientWidth);if(progress)progress.style.width=Math.max(8,Math.min(100,25+(rail.scrollLeft/max)*75))+'%';if(prev)prev.disabled=rail.scrollLeft<=2;if(next)next.disabled=rail.scrollLeft>=max-2}
    if(prev)prev.addEventListener('click',function(){rail.scrollBy({left:-step(),behavior:'smooth'})});
    if(next)next.addEventListener('click',function(){rail.scrollBy({left:step(),behavior:'smooth'})});
    rail.addEventListener('scroll',updateRail,{passive:true}); updateRail();
  });
});
