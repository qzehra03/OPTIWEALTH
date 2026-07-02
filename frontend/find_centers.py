import cv2
import numpy as np

img = cv2.imread('public/bg-triangle-dark.png')
if img is None:
    print("Failed to load image")
    exit()

H, W = img.shape[:2]

# The gold lines are bright, the background is dark green.
# Let's convert to grayscale and threshold to isolate the dark regions.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)

# Clean up noise
kernel = np.ones((5,5), np.uint8)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

centers = []
for c in contours:
    area = cv2.contourArea(c)
    if area > (W * H * 0.005): # At least 0.5% of the image area
        M = cv2.moments(c)
        if M["m00"] != 0:
            cx = M["m10"] / M["m00"]
            cy = M["m01"] / M["m00"]
            centers.append((cx / W * 100, cy / H * 100, area))

# Sort from top-left to bottom-right
centers.sort(key=lambda p: (p[1] // 15, p[0]))

print(f"Found {len(centers)} regions.")
for i, (cx, cy, area) in enumerate(centers):
    print(f"Region {i}: cx={cx:.2f}%, cy={cy:.2f}%, area={area}")

# Draw centers to debug
debug_img = img.copy()
for i, (cx, cy, area) in enumerate(centers):
    px, py = int(cx * W / 100), int(cy * H / 100)
    cv2.circle(debug_img, (px, py), 10, (0, 0, 255), -1)
    cv2.putText(debug_img, str(i), (px+15, py), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    
cv2.imwrite('public/debug_centers.png', debug_img)
print("Saved debug_centers.png")
