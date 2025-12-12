import matplotlib.pyplot as plt
import numpy as np

# 한글 폰트 설정 (Mac용)
try:
    plt.rc('font', family='AppleGothic')
except:
    pass
plt.rcParams['axes.unicode_minus'] = False

# 데이터 준비
years = ['25', '26', '27', '28']
x = np.arange(len(years))

# 각 항목별 데이터 (아래에서 위 순서)
# 1. 디지털
digital = np.array([50, 40, 30, 30])
# 2. AX
ax_data = np.array([10, 30, 50, 60])
# 3. 프로젝트
project = np.array([2, 5, 10, 20])
# 4. 서비스 (25년은 없으므로 0으로 시작, 26년부터 5, 15, 30)
service = np.array([0, 5, 15, 30])

# 색상 팔레트 설정 (아래에서 위로 갈수록 밝아지거나 강조되는 색상)
# 디지털(기반): 차분한 회색/남색 -> 비즈니스의 기반
# AX(핵심): 짙은 파랑 -> 기술의 핵심
# 프로젝트: 밝은 파랑 -> 확장
# 서비스: 청록/민트 -> 미래 가치
colors = ['#7f8c8d', '#2980b9', '#3498db', '#1abc9c']
labels = ['디지털', 'AX', '프로젝트', '서비스']

fig, ax = plt.subplots(figsize=(12, 7))

# 막대 너비
width = 0.5

# 누적 막대 그리기
# p1: 디지털
p1 = ax.bar(x, digital, width, label=labels[0], color=colors[0], zorder=3, edgecolor='white', linewidth=1)
# p2: AX (디지털 위에)
p2 = ax.bar(x, ax_data, width, bottom=digital, label=labels[1], color=colors[1], zorder=3, edgecolor='white', linewidth=1)
# p3: 프로젝트 (디지털+AX 위에)
p3 = ax.bar(x, project, width, bottom=digital+ax_data, label=labels[2], color=colors[2], zorder=3, edgecolor='white', linewidth=1)
# p4: 서비스 (디지털+AX+프로젝트 위에)
p4 = ax.bar(x, service, width, bottom=digital+ax_data+project, label=labels[3], color=colors[3], zorder=3, edgecolor='white', linewidth=1)

# 값 텍스트 표시 함수
def add_labels(bars):
    for bar in bars:
        height = bar.get_height()
        if height > 0:  # 값이 0보다 클 때만 표시
            # 글자 크기와 굵기 조정
            ax.text(bar.get_x() + bar.get_width()/2.,
                    bar.get_y() + height/2.,
                    f'{int(height)}',
                    ha='center', va='center', color='white', fontweight='bold', fontsize=11)

add_labels(p1)
add_labels(p2)
add_labels(p3)
add_labels(p4)

# 왼쪽 텍스트 수정: AX -> 맨 아랫칸 (디지털 층), Agent -> 두번째 칸 (AX 층)
# 위치: 25년 (index 0) 기준 왼쪽 여백 활용

# 1. AX 라벨 (디지털 층 - 맨 아래)
ax_label_y = digital[0] / 2
ax.text(-0.6, ax_label_y, 'AX', fontsize=16, fontweight='bold', ha='right', va='center', color='#34495e')
# 연결선 (화살표 없이 심플하게)
ax.annotate('', xy=(x[0] - width/2, ax_label_y), xytext=(-0.55, ax_label_y),
            arrowprops=dict(arrowstyle='-', color='#7f8c8d', linewidth=1.5))

# 2. Agent 라벨 (AX 층 - 두번째)
agent_label_y = digital[0] + ax_data[0] / 2
ax.text(-0.6, agent_label_y, 'Agent', fontsize=16, fontweight='bold', ha='right', va='center', color='#34495e')
# 연결선
ax.annotate('', xy=(x[0] - width/2, agent_label_y), xytext=(-0.55, agent_label_y),
            arrowprops=dict(arrowstyle='-', color='#2980b9', linewidth=1.5))


# 오른쪽 '솔루션' 묶음 표시
# 28년 (index 3) 기준
# 묶을 대상: 아래에서부터 3칸 (디지털, AX, 프로젝트)
idx = 3
y_start_sol = 0
y_end_sol = digital[idx] + ax_data[idx] + project[idx]
x_pos = x[idx] + width/2 # 막대 오른쪽 끝 x좌표
margin = 0.1 # 선 간격

# ㄷ자 모양 선 그리기 (오른쪽으로 열린 모양)
line_x = [x_pos, x_pos + margin, x_pos + margin, x_pos]
line_y = [y_start_sol, y_start_sol, y_end_sol, y_end_sol]

ax.plot(line_x, line_y, color='#2c3e50', linewidth=1.5, zorder=10)

# '솔루션' 텍스트
ax.text(x_pos + margin + 0.05, (y_start_sol + y_end_sol)/2, '솔루션', 
        fontsize=16, fontweight='bold', ha='left', va='center', color='#2c3e50')


# X축 설정
ax.set_xticks(x)
ax.set_xticklabels(years, fontsize=14, fontweight='bold', color='#34495e')

# Y축 범위 및 스타일
ax.set_ylim(0, 160)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_visible(False)
ax.get_yaxis().set_visible(False)

# 배경색 살짝 추가 (선택)
ax.set_facecolor('#f8f9fa')
fig.patch.set_facecolor('#f8f9fa')

# 범례 표시 (그래프 상단)
ax.legend(loc='upper center', bbox_to_anchor=(0.5, 1.05), ncol=4, frameon=False, fontsize=12)

plt.tight_layout()

# 저장
output_path = 'ax_agent_graph.png'
plt.savefig(output_path, dpi=300)
print(f"Graph saved to {output_path}")
