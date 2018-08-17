/**
 * Facebook Pixel Teardown and Setup Scripts
 * Purpose: To fire events individually between Facebook pixel sessions by offering tear down and setup
 * commands for anything FB pixel related. This allows us to fire events ONLY for our pixels
 */
function FBQ() {
  if (!window.fbqblock)
    window.fbqblock = false;

  return {
    loadFBEvents: function() {
      !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;
        n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);
        t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
      } (window, document,'script','//connect.facebook.net/en_US/fbevents.js');
    },
    wipeFBEvents: function() {
      // get a clean fbq.
      window.fbq = window._fbq = undefined;
    },
    uponEmptyQueue: function(fns, frequency, limit) {
      if(!frequency) frequency = 100;
      if(!limit) limit = 1000;
      // if we don't have an fbq, there won't be anything outstanding.
      if(!window.fbq) this.loadFBEvents();

      var counter = 0;
      var repetitionReference = setInterval(function() {
        // if there's nothing outstanding, we have an empty queue. run something.
        if (fbq.queue.length === 0 && !fbqblock) {
          fbqblock = true;
          fns.shift()();
          if (fns.length === 0)
            clearInterval(repetitionReference);
          fbqblock = false;
        }

        counter++;
        if(counter > limit) {
          console.log("Tried too many times. Limit is ", limit);
          clearInterval(repetitionReference);
        }
      }, frequency);
    }
  };
}

/**
 * Scoped function that we call to run any FB Pixel event that automatically runs
 * the setup and teardown functions and placed our closure inside
 * @param func {function}
 */
function FBQ_SETUP(pixel, func) {
  if (FBQ) {
    var libfbq = FBQ();
    if (pixel) {
      libfbq.uponEmptyQueue([function() {
        libfbq.wipeFBEvents();
        libfbq.loadFBEvents();

        // Initialize pixel here
        fbq('init', pixel);

        // Run the closure (what events we want to fire)
        func();
      }, function() {
        // Clean and return Facebook events to an initial state.
        libfbq.wipeFBEvents();
        libfbq.loadFBEvents();
      }]);
    } else {
      console.log('fbpixel: Pixel must be provided to FBQ_SETUP as first parameter');
    }
  } else {
    console.log('fbqpixel: No FBQ function was found');
  }
}
