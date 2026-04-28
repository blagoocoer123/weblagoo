(function() {
    'use strict';
    
    const title = "weblagoo";
    let charIndex = 0;
    let isTyping = true;
    let isPaused = false;
    
    document.title = "";
    
    setInterval(() => {
        if (isPaused) return;
        
        if (isTyping) {
            if (charIndex < title.length) {
                charIndex++;
                document.title = title.substring(0, charIndex);
            } else {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isTyping = false;
                }, 3000);
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
                document.title = title.substring(0, charIndex);
            } else {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isTyping = true;
                }, 500);
            }
        }
    }, 200);
})();
