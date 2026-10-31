/* MEDIA KOLFAT official cinematic trailer.
 * Privacy-friendly facade: do not load YouTube unless Play is clicked.
 * The official YouTube embed is created only on user activation. */
(function(){
  'use strict';
  var VIDEO_ID='j1TcMOpWN9M';
  function init(){
    document.querySelectorAll('[data-kf-cinematic-video]').forEach(function(frame){
      var play=frame.querySelector('.kf-video-play');
      if(!play)return;
      play.addEventListener('click',function(){
        if(frame.dataset.videoStarted==='true')return;
        var iframe=document.createElement('iframe');
        iframe.src='https://www.youtube-nocookie.com/embed/'+VIDEO_ID+'?autoplay=1&rel=0&playsinline=1';
        iframe.title=play.getAttribute('aria-label')||'MEDIA KOLFAT Cinematic Trailer';
        iframe.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
        iframe.setAttribute('allowfullscreen','');
        iframe.setAttribute('loading','eager');
        var fallback=document.createElement('a');
        fallback.href='https://youtu.be/'+VIDEO_ID;
        fallback.target='_blank';
        fallback.rel='noopener noreferrer';
        fallback.className='kf-video-watch-on-youtube';
        fallback.textContent='YouTube ↗';
        fallback.setAttribute('aria-label','Watch MEDIA KOLFAT on YouTube');
        frame.replaceChildren(iframe,fallback);
        frame.dataset.videoStarted='true';
      },{once:true});
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{init();}
})();
