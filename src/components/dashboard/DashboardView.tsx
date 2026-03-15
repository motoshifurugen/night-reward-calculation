import type { AuthUser } from "@/store/authStore";

type DashboardViewProps = {
  user: AuthUser;
  onLogout: () => void;
};

export default function DashboardView({ user, onLogout }: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#1A1A1A]">NightReward</h1>
        <button
          onClick={onLogout}
          className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          ログアウト
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* ウェルカムメッセージ */}
        <section className="mb-6">
          <p className="text-[#6B7280] text-sm">おかえりなさい</p>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            {user.displayName} さん
          </h2>
        </section>

        {/* 今日のカロリーカード */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] mb-6">
          <h3 className="text-sm font-medium text-[#6B7280] mb-1">
            今日の摂取カロリー
          </h3>
          <p className="text-4xl font-bold text-[#1A1A1A]">
            0 <span className="text-lg font-normal text-[#6B7280]">kcal</span>
          </p>
        </section>

        {/* 空状態 */}
        <section className="text-center py-12">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-[#6B7280] mb-6">今日の記録はまだありません</p>
          <button className="flex items-center gap-2 bg-primary hover:bg-yellow-400 text-[#1A1A1A] font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200 active:scale-95 mx-auto">
            <span className="text-xl leading-none">+</span>
            食事を記録する
          </button>
        </section>
      </main>
    </div>
  );
}
