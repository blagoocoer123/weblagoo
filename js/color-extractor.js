// Extract dominant color from avatar and apply to card
function extractDominantColor(imgElement, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = imgElement.width;
  canvas.height = imgElement.height;
  
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let r = 0, g = 0, b = 0;
  let count = 0;
  
  // Sample pixels (every 10th pixel for performance)
  for (let i = 0; i < data.length; i += 40) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  
  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);
  
  callback({ r, g, b });
}

function applyColorToCard(color) {
  const rectangle = document.querySelector('.rectangle');
  const rectangleRight = document.querySelector('.rectangle-right');
  const avatar = document.querySelector('.avatar');
  
  if (!rectangle) return;
  
  const { r, g, b } = color;
  
  // Create color variations
  const primaryColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
  const glowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
  const borderColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
  const shadowColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
  
  // Apply to main card
  rectangle.style.background = primaryColor;
  rectangle.style.boxShadow = `
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    0 0 60px ${glowColor},
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `;
  
  // Update border gradient
  const beforeStyle = `
    linear-gradient(45deg, ${borderColor}, rgba(${r + 30}, ${g + 30}, ${b + 30}, 0.4), ${borderColor})
  `;
  rectangle.style.setProperty('--border-gradient', beforeStyle);
  
  // Apply to avatar
  if (avatar) {
    avatar.style.boxShadow = `
      0 0 40px ${shadowColor},
      0 0 80px rgba(${r}, ${g}, ${b}, 0.2),
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `;
    avatar.style.borderColor = borderColor;
  }
  
  // Apply to right card if exists
  if (rectangleRight) {
    rectangleRight.style.background = primaryColor;
    rectangleRight.style.boxShadow = `
      0 8px 32px 0 rgba(31, 38, 135, 0.37),
      0 0 60px ${glowColor},
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `;
  }
  
  // Update animated circles color
  updateCirclesColor(r, g, b);
}

function updateCirclesColor(r, g, b) {
  const circleColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
  
  // Update existing circles
  document.querySelectorAll('.rectangle > div, .rectangle-right > div').forEach(circle => {
    if (circle.style.borderRadius === '50%' && circle.style.position === 'absolute') {
      circle.style.backgroundColor = circleColor;
    }
  });
  
  // Store color for new circles
  window.avatarColor = { r, g, b };
}

// Initialize color extraction when avatar loads
document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.querySelector('.avatar');
  
  if (avatar) {
    if (avatar.complete) {
      extractDominantColor(avatar, applyColorToCard);
    } else {
      avatar.addEventListener('load', () => {
        extractDominantColor(avatar, applyColorToCard);
      });
    }
  }
});
