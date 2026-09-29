import { useEffect, useState } from "react";
import "./App.css";

const categories = [
  "إيجار المنزل",
  "بنزين",
  "طعام",
  "مصروف الأولاد",
  "كهرباء وماء",
  "هاتف وإنترنت",
  "تعليم",
  "مشتريات",
  "صحة",
  "ترفيه",
  "شيء آخر",
];

const starterTransactions = [
  {
    id: 1,
    type: "income",
    title: "راتب",
    category: "دخل",
    amount: 1200,
    date: "2026-09-25",
  },
  {
    id: 2,
    type: "expense",
    title: "بنزين",
    category: "بنزين",
    amount: 45,
    date: "2026-09-24",
  },
  {
    id: 3,
    type: "expense",
    title: "طعام",
    category: "طعام",
    amount: 70,
    date: "2026-09-23",
  },
];

function App() {
  const [page, setPage] = useState(window.location.pathname);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("alayanUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("alayanTransactions");
    return saved ? JSON.parse(saved) : starterTransactions;
  });

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setPage(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPage(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "alayanTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const createAccount = (name, email) => {
    const newUser = { name, email };

    localStorage.setItem(
      "alayanUser",
      JSON.stringify(newUser)
    );

    setUser(newUser);
    navigate("/dashboard");
  };

  const login = (email) => {
    const savedUser = localStorage.getItem("alayanUser");

    const loggedUser = savedUser
      ? JSON.parse(savedUser)
      : {
          name: "مستخدم Alayan",
          email,
        };

    localStorage.setItem(
      "alayanUser",
      JSON.stringify(loggedUser)
    );

    setUser(loggedUser);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("alayanUser");
    setUser(null);
    navigate("/");
  };

  const addTransaction = (transaction) => {
    setTransactions((current) => [
      {
        ...transaction,
        id: Date.now(),
      },
      ...current,
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  if (page === "/signup") {
    return (
      <AuthPage
        title="إنشاء حساب"
        subtitle="ابدأ بإدارة أموالك بطريقة أذكى."
        onHome={() => navigate("/")}
      >
        <SignUp
          onSubmit={createAccount}
          onLogin={() => navigate("/login")}
        />
      </AuthPage>
    );
  }

  if (page === "/login") {
    return (
      <AuthPage
        title="تسجيل الدخول"
        subtitle="مرحباً بك من جديد في Alayan Money."
        onHome={() => navigate("/")}
      >
        <Login
          onSubmit={login}
          onSignup={() => navigate("/signup")}
        />
      </AuthPage>
    );
  }

  if (page === "/dashboard") {
    if (!user) {
      return (
        <AuthPage
          title="تسجيل الدخول"
          subtitle="سجّل الدخول للوصول إلى حسابك."
          onHome={() => navigate("/")}
        >
          <Login
            onSubmit={login}
            onSignup={() => navigate("/signup")}
          />
        </AuthPage>
      );
    }

    return (
      <Dashboard
        user={user}
        transactions={transactions}
        onLogout={logout}
        onAdd={addTransaction}
        onDelete={deleteTransaction}
      />
    );
  }

  return (
    <Landing
      onSignup={() => navigate("/signup")}
      onLogin={() => navigate("/login")}
    />
  );
}


/* =========================
   LANDING
========================= */

function Landing({ onSignup, onLogin }) {
  return (
    <div className="landing">

      <nav className="navbar">

        <div className="brand">
          <div className="logo">A</div>
          <strong>Alayan Money</strong>
        </div>

        <div className="nav-buttons">
          <button
            className="login-button"
            onClick={onLogin}
          >
            تسجيل الدخول
          </button>

          <button
            className="primary-button"
            onClick={onSignup}
          >
            ابدأ الآن
          </button>
        </div>

      </nav>

      <main className="hero">

        <div className="tag">
          SMART PERSONAL FINANCE
        </div>

        <h1>
          سيطر على
          <br />
          <span>أموالك بسهولة.</span>
        </h1>

        <p>
          تابع دخلك ومصاريفك ومدخراتك
          <br />
          من مكان واحد وبطريقة بسيطة.
        </p>

        <button
          className="primary-button hero-button"
          onClick={onSignup}
        >
          ابدأ بإدارة أموالك
          <span>←</span>
        </button>

      </main>

      <section className="features">

        <Feature
          icon="↗"
          title="تتبع الدخل"
          text="سجّل دخلك وحافظ على تنظيم أموالك بطريقة واضحة."
        />

        <Feature
          icon="↘"
          title="إدارة المصاريف"
          text="اعرف أين تذهب أموالك وتابع مصاريفك بسهولة."
        />

        <Feature
          icon="$"
          title="اعرف رصيدك"
          text="احصل على نظرة واضحة عن وضعك المالي في أي وقت."
        />

      </section>

    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


/* =========================
   AUTH
========================= */

function AuthPage({
  title,
  subtitle,
  onHome,
  children,
}) {
  return (
    <div className="auth-page">

      <button
        className="home-link"
        onClick={onHome}
      >
        ← الرئيسية
      </button>

      <div className="auth-card">

        <div className="auth-logo">
          A
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>

        {children}

      </div>

    </div>
  );
}

function SignUp({ onSubmit, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    onSubmit(name, email);
  };

  return (
    <>
      <form onSubmit={submit}>

        <label>الاسم الكامل</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك"
        />

        <label>البريد الإلكتروني</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />

        <label>كلمة المرور</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button className="primary-button full">
          إنشاء الحساب
        </button>

      </form>

      <div className="switch">
        لديك حساب بالفعل؟
        <button onClick={onLogin}>
          تسجيل الدخول
        </button>
      </div>
    </>
  );
}

function Login({ onSubmit, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("أدخل البريد الإلكتروني وكلمة المرور");
      return;
    }

    onSubmit(email);
  };

  return (
    <>
      <form onSubmit={submit}>

        <label>البريد الإلكتروني</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />

        <label>كلمة المرور</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button className="primary-button full">
          تسجيل الدخول
        </button>

      </form>

      <div className="switch">
        ليس لديك حساب؟
        <button onClick={onSignup}>
          إنشاء حساب
        </button>
      </div>
    </>
  );
}


/* =========================
   DASHBOARD
========================= */

function Dashboard({
  user,
  transactions,
  onLogout,
  onAdd,
  onDelete,
}) {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("expense");
  const [active, setActive] = useState("home");

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expenses;

  const openAdd = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="logo">A</div>
          <strong>Alayan Money</strong>
        </div>

        <button
          className={active === "home" ? "side active" : "side"}
          onClick={() => setActive("home")}
        >
          🏠 الرئيسية
        </button>

        <button
          className={
            active === "transactions"
              ? "side active"
              : "side"
          }
          onClick={() => setActive("transactions")}
        >
          📋 المعاملات
        </button>

        <button
          className={
            active === "statistics"
              ? "side active"
              : "side"
          }
          onClick={() => setActive("statistics")}
        >
          📊 الإحصائيات
        </button>

        <button
          className={
            active === "profile"
              ? "side active"
              : "side"
          }
          onClick={() => setActive("profile")}
        >
          👤 حسابي
        </button>

        <div className="sidebar-bottom">

          <button
            className="side logout"
            onClick={onLogout}
          >
            ↪ تسجيل الخروج
          </button>

        </div>

      </aside>

      <main className="dashboard-content">

        <header className="dashboard-header">

          <div>
            <small>لوحة التحكم</small>

            <h1>
              أهلاً، {user.name} 👋
            </h1>

            <p>
              إليك نظرة سريعة على وضعك المالي.
            </p>
          </div>

          <div className="avatar">
            {user.name.charAt(0)}
          </div>

        </header>

        {active === "home" && (
          <>
            <Stats
              balance={balance}
              income={income}
              expenses={expenses}
            />

            <div className="quick">

              <button
                onClick={() => openAdd("income")}
              >
                <span>＋</span>
                <div>
                  <strong>إضافة دخل</strong>
                  <small>سجّل دخل جديد</small>
                </div>
              </button>

              <button
                onClick={() => openAdd("expense")}
              >
                <span>−</span>
                <div>
                  <strong>إضافة مصروف</strong>
                  <small>سجّل مصروف جديد</small>
                </div>
              </button>

            </div>

            <Transactions
              transactions={transactions.slice(0, 5)}
              onDelete={onDelete}
            />
          </>
        )}

        {active === "transactions" && (
          <Transactions
            transactions={transactions}
            onDelete={onDelete}
          />
        )}

        {active === "statistics" && (
          <Statistics
            income={income}
            expenses={expenses}
          />
        )}

        {active === "profile" && (
          <div className="profile">
            <div className="profile-avatar">
              {user.name.charAt(0)}
            </div>

            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        )}

      </main>

      {showForm && (
        <TransactionForm
          type={formType}
          onClose={() => setShowForm(false)}
          onSave={(transaction) => {
            onAdd(transaction);
            setShowForm(false);
          }}
        />
      )}

    </div>
  );
}


/* =========================
   STATS
========================= */

function Stats({ balance, income, expenses }) {
  return (
    <div className="stats">

      <div className="stat">
        <span>الرصيد الحالي</span>
        <strong>${balance.toLocaleString()}</strong>
        <small>المتبقي</small>
      </div>

      <div className="stat">
        <span>إجمالي الدخل</span>
        <strong className="green">
          ${income.toLocaleString()}
        </strong>
        <small>الدخل</small>
      </div>

      <div className="stat">
        <span>إجمالي المصاريف</span>
        <strong className="red">
          ${expenses.toLocaleString()}
        </strong>
        <small>المصاريف</small>
      </div>

    </div>
  );
}


/* =========================
   TRANSACTIONS
========================= */

function Transactions({
  transactions,
  onDelete,
}) {
  return (
    <section className="transactions">

      <div className="section-title">
        <div>
          <small>سجل العمليات</small>
          <h2>المعاملات</h2>
        </div>
      </div>

      <div className="transaction-list">

        {transactions.length === 0 && (
          <p className="empty">
            لا توجد معاملات.
          </p>
        )}

        {transactions.map((item) => (
          <div
            className="transaction"
            key={item.id}
          >

            <div className="transaction-icon">
              {item.type === "income" ? "↗" : "↘"}
            </div>

            <div className="transaction-info">
              <strong>{item.title}</strong>
              <small>
                {item.category} · {item.date}
              </small>
            </div>

            <strong
              className={
                item.type === "income"
                  ? "green"
                  : "red"
              }
            >
              {item.type === "income" ? "+" : "-"}
              ${Number(item.amount).toLocaleString()}
            </strong>

            <button
              className="delete"
              onClick={() => onDelete(item.id)}
            >
              ×
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}


/* =========================
   TRANSACTION FORM
========================= */

function TransactionForm({
  type,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(
    type === "income" ? "دخل" : categories[0]
  );

  const submit = (e) => {
    e.preventDefault();

    if (!title || !amount) {
      alert("أدخل اسم العملية والمبلغ");
      return;
    }

    onSave({
      type,
      title,
      category,
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="modal-bg">

      <div className="modal">

        <button
          className="close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>
          {type === "income"
            ? "إضافة دخل"
            : "إضافة مصروف"}
        </h2>

        <p>
          أدخل معلومات العملية الجديدة.
        </p>

        <form onSubmit={submit}>

          <label>اسم العملية</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === "income"
                ? "مثلاً: راتب"
                : "مثلاً: بنزين"
            }
          />

          <label>المبلغ</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />

          <label>التصنيف</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {type === "expense" &&
              categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}

            {type === "income" && (
              <option>دخل</option>
            )}
          </select>

          <button className="primary-button full">
            حفظ العملية
          </button>

        </form>

      </div>

    </div>
  );
}


/* =========================
   STATISTICS
========================= */

function Statistics({
  income,
  expenses,
}) {
  const percentage =
    income > 0
      ? Math.min((expenses / income) * 100, 100)
      : 0;

  return (
    <section className="statistics">

      <small>تحليل مالي</small>

      <h2>الإحصائيات</h2>

      <div className="stat-boxes">

        <div>
          <span>الدخل</span>
          <strong className="green">
            ${income.toLocaleString()}
          </strong>
        </div>

        <div>
          <span>المصاريف</span>
          <strong className="red">
            ${expenses.toLocaleString()}
          </strong>
        </div>

      </div>

      <div className="chart">

        <h3>نسبة المصاريف من الدخل</h3>

        <div className="bar-bg">
          <div
            className="bar"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <strong>
          {percentage.toFixed(0)}%
        </strong>

      </div>

    </section>
  );
}

export default App;