import tkinter as tk
from tkinter import font
import random

def generate_lotto_numbers():
    numbers = list(range(1, 46))
    selected_numbers = random.sample(numbers, 6)
    selected_numbers.sort()
    return selected_numbers

def get_ball_color(number):
    if 1 <= number <= 10:
        return "#fbc400" # Yellow
    elif 11 <= number <= 20:
        return "#69c8f2" # Blue
    elif 21 <= number <= 30:
        return "#ff7272" # Red
    elif 31 <= number <= 40:
        return "#aaaaaa" # Gray
    else:
        return "#b0d840" # Green

def draw_balls():
    # Clear previous balls
    canvas.delete("all")
    
    numbers = generate_lotto_numbers()
    
    # Canvas settings
    canvas_width = 600
    canvas_height = 200
    ball_radius = 30
    gap = 20
    
    # Calculate starting x position to center the balls
    total_width = (ball_radius * 2 * 6) + (gap * 5)
    start_x = (canvas_width - total_width) / 2
    y_pos = canvas_height / 2
    
    for i, number in enumerate(numbers):
        x_pos = start_x + i * (ball_radius * 2 + gap) + ball_radius
        
        # Draw circle
        color = get_ball_color(number)
        canvas.create_oval(
            x_pos - ball_radius, y_pos - ball_radius,
            x_pos + ball_radius, y_pos + ball_radius,
            fill=color, outline=color
        )
        
        # Draw text
        text_color = "black" if color == "#fbc400" else "white"
        canvas.create_text(
            x_pos, y_pos,
            text=str(number),
            font=("Helvetica", 20, "bold"),
            fill=text_color
        )
    
    result_label.config(text=f"생성된 번호: {numbers}")

# Create main window
root = tk.Tk()
root.title("로또 6/45 번호 생성기")
root.geometry("600x400")
root.resizable(False, False)

# Title Label
title_font = font.Font(family="Helvetica", size=24, weight="bold")
title_label = tk.Label(root, text="인생 역전! 로또 6/45", font=title_font)
title_label.pack(pady=30)

# Canvas for drawing balls
canvas = tk.Canvas(root, width=600, height=200, bg="white", highlightthickness=0)
canvas.pack()

# Result Label (text fallback)
result_label = tk.Label(root, text="버튼을 눌러 번호를 생성하세요", font=("Helvetica", 14))
result_label.pack(pady=10)

# Generate Button
btn_font = font.Font(family="Helvetica", size=16, weight="bold")
generate_btn = tk.Button(root, text="번호 생성하기", command=draw_balls, 
                         bg="#4a90e2", fg="black", font=btn_font, 
                         width=15, height=2)
generate_btn.pack(pady=20)

# Run the app
if __name__ == "__main__":
    root.mainloop()
