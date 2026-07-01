import cv2
import numpy as np
import json

img = cv2.imread('public/bg-triangle-dark.png')
h, w = img.shape[:2]
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 60, 255, cv2.THRESH_BINARY_INV)
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

polygons = []
for cnt in contours:
    epsilon = 0.02 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    area = cv2.contourArea(cnt)
    if area > 10000:
        M = cv2.moments(cnt)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            pts = [f"{pt[0][0]/w*100:.2f}% {pt[0][1]/h*100:.2f}%" for pt in approx]
            polygons.append({
                "cx": round(cx/w*100, 2),
                "cy": round(cy/h*100, 2),
                "pts": pts,
                "area": area
            })

polygons.sort(key=lambda p: p['cy']) # Sort by Y to roughly guess positions
print(json.dumps(polygons, indent=2))
