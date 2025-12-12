import random

def get_lotto_ball_string(number):
    """
    이모지를 사용하여 공 모양과 함께 숫자를 반환합니다.
    터미널 환경에서 가장 공처럼 보이는 방법입니다.
    """
    # 숫자 범위에 따른 공 색상 이모지
    if 1 <= number <= 10:
        emoji = "🟡" # Yellow ball
    elif 11 <= number <= 20:
        emoji = "🔵" # Blue ball
    elif 21 <= number <= 30:
        emoji = "🔴" # Red ball
    elif 31 <= number <= 40:
        emoji = "⚪" # White/Gray ball
    else:
        emoji = "🟢" # Green ball
        
    return f"{emoji} {number:02d}"

def generate_lotto_numbers():
    """
    1부터 45까지의 숫자 중에서 6개를 무작위로 선택합니다.
    """
    numbers = list(range(1, 46))
    selected_numbers = random.sample(numbers, 6)
    selected_numbers.sort()
    return selected_numbers

if __name__ == "__main__":
    print("\n=== 로또 6/45 번호 생성기 ===\n")
    lotto_numbers = generate_lotto_numbers()
    
    # 이모지와 함께 출력
    output = "   ".join([get_lotto_ball_string(n) for n in lotto_numbers])
    print(f"생성된 번호:  {output}\n")
