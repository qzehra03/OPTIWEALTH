import cv2
import numpy as np

img_path = r"C:\Users\hp\Downloads\OPTIWEALTH\8acd3070-eeb3-4015-a281-21f7b330c403.png"
img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
_, thresh = cv2.threshold(img, 128, 255, cv2.THRESH_BINARY_INV)
contours, _ = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)

H, W = img.shape
polygons = []
for i, contour in enumerate(contours):
    area = cv2.contourArea(contour)
    if area > 5000: # Filter small decorations and text box
        epsilon = 0.01 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        M = cv2.moments(contour)
        if M["m00"] != 0:
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])
        else:
            cX, cY = 0, 0
        polygons.append({
            'area': area,
            'cx': cX,
            'cy': cY,
            'pts': approx
        })

# Sort roughly top-to-bottom, left-to-right
polygons.sort(key=lambda p: (p['cy'] // 100, p['cx']))

# Draw them on a new image to verify
debug_img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
for i, p in enumerate(polygons):
    cv2.drawContours(debug_img, [p['pts']], -1, (0, 255, 0), 2)
    cv2.putText(debug_img, str(i), (p['cx']-10, p['cy']), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    pts_pct = []
    for pt in p['pts']:
        x, y = pt[0]
        pts_pct.append(f"{x/W*100:.2f}% {y/H*100:.2f}%")
    print(f"Poly {i}: cx={p['cx']/W*100:.1f}%, cy={p['cy']/H*100:.1f}%")
    print(f"  clip-path: {', '.join(pts_pct)}")

cv2.imwrite("public/debug_bw_polys.png", debug_img)
print("Saved debug_bw_polys.png")
