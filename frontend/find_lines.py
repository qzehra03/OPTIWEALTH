import cv2
import numpy as np

img = cv2.imread('public/bg-triangle-light.png')
if img is None:
    print("Failed to load public/bg-triangle-light.png")
    exit(1)
    
print("Shape:", img.shape)
# Convert to HSV to isolate gold lines
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Gold is roughly hue 20-40.
lower_gold = np.array([15, 50, 50])
upper_gold = np.array([45, 255, 255])
mask = cv2.inRange(hsv, lower_gold, upper_gold)

# Try to find contours
contours, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)

polys = []
H, W = img.shape[:2]

for c in contours:
    area = cv2.contourArea(c)
    if area > 1000: # Filter noise
        epsilon = 0.015 * cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, epsilon, True)
        
        # If it's a polygon with 3-6 sides
        if len(approx) >= 3 and len(approx) <= 8:
            pts = []
            for pt in approx:
                pts.append(f"{pt[0][0]/W*100:.2f}% {pt[0][1]/H*100:.2f}%")
            polys.append(", ".join(pts))

print(f"Found {len(polys)} polygons.")
for p in polys:
    print(p)

cv2.imwrite('public/debug_lines.png', mask)
