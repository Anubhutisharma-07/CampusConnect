import { useState, useMemo } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Search from "lucide-react/dist/esm/icons/search";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Clock from "lucide-react/dist/esm/icons/clock";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import Star from "lucide-react/dist/esm/icons/star";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import Filter from "lucide-react/dist/esm/icons/filter";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import X from "lucide-react/dist/esm/icons/x";
import Users from "lucide-react/dist/esm/icons/users";
import Eye from "lucide-react/dist/esm/icons/eye";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Zap from "lucide-react/dist/esm/icons/zap";
import Award from "lucide-react/dist/esm/icons/award";
import Tag from "lucide-react/dist/esm/icons/tag";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";

// ─── Types ──────────────────────────────────────────────────
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  cover: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  shelf: string;
  description: string;
  pages: number;
  published: string;
  language: string;
  edition: string;
  tags: string[];
  waitlist: number;
  popularity: number;
}

interface Reservation {
  bookId: string;
  bookTitle: string;
  reservedDate: string;
  dueDate: string;
  status: "active" | "overdue" | "returned" | "pending";
  renewable: boolean;
}

interface ReadingList {
  id: string;
  name: string;
  books: string[];
  created: string;
}

// ─── Data ───────────────────────────────────────────────────
const GENRES = [
  "All",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Literature",
  "Business",
  "Psychology",
  "History",
  "Science Fiction",
];

const BOOKS: Book[] = [
  {
    id: "b-1",
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest, Stein",
    isbn: "978-0262046305",
    genre: "Computer Science",
    cover: "📕",
    rating: 4.8,
    totalCopies: 8,
    availableCopies: 3,
    shelf: "CS-101",
    description:
      "Comprehensive guide to algorithms covering sorting, searching, graph algorithms, dynamic programming, and more.",
    pages: 1312,
    published: "2022",
    language: "English",
    edition: "4th Edition",
    tags: ["Algorithms", "DSA", "Textbook"],
    waitlist: 2,
    popularity: 98,
  },
  {
    id: "b-2",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    genre: "Computer Science",
    cover: "📗",
    rating: 4.9,
    totalCopies: 5,
    availableCopies: 1,
    shelf: "CS-205",
    description:
      "Deep dive into data systems — replication, partitioning, transactions, consistency, and stream processing.",
    pages: 616,
    published: "2017",
    language: "English",
    edition: "1st Edition",
    tags: ["Distributed Systems", "Databases", "Architecture"],
    waitlist: 5,
    popularity: 95,
  },
  {
    id: "b-3",
    title: "Linear Algebra Done Right",
    author: "Sheldon Axler",
    isbn: "978-3319110790",
    genre: "Mathematics",
    cover: "📘",
    rating: 4.6,
    totalCopies: 6,
    availableCopies: 4,
    shelf: "MATH-301",
    description:
      "Modern approach to linear algebra emphasizing vector spaces and linear maps over determinants and matrices.",
    pages: 410,
    published: "2015",
    language: "English",
    edition: "3rd Edition",
    tags: ["Linear Algebra", "Mathematics", "Proofs"],
    waitlist: 0,
    popularity: 82,
  },
  {
    id: "b-4",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    genre: "Computer Science",
    cover: "📙",
    rating: 4.5,
    totalCopies: 10,
    availableCopies: 7,
    shelf: "CS-102",
    description:
      "Handbook of agile software craftsmanship — writing clean, readable, and maintainable code.",
    pages: 464,
    published: "2008",
    language: "English",
    edition: "1st Edition",
    tags: ["Software Engineering", "Best Practices", "Agile"],
    waitlist: 0,
    popularity: 90,
  },
  {
    id: "b-5",
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    isbn: "978-0135957059",
    genre: "Computer Science",
    cover: "📕",
    rating: 4.7,
    totalCopies: 6,
    availableCopies: 2,
    shelf: "CS-103",
    description:
      "Timeless advice on software development — DRY principle, orthogonality, tracer bullets, and more.",
    pages: 352,
    published: "2019",
    language: "English",
    edition: "2nd Edition",
    tags: ["Programming", "Career", "Best Practices"],
    waitlist: 3,
    popularity: 88,
  },
  {
    id: "b-6",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    genre: "Psychology",
    cover: "📗",
    rating: 4.4,
    totalCopies: 4,
    availableCopies: 0,
    shelf: "PSY-201",
    description:
      "Nobel laureate explains the two systems that drive the way we think — fast intuitive and slow deliberate.",
    pages: 499,
    published: "2011",
    language: "English",
    edition: "1st Edition",
    tags: ["Psychology", "Decision Making", "Cognitive"],
    waitlist: 4,
    popularity: 85,
  },
  {
    id: "b-7",
    title: "Fundamentals of Physics",
    author: "Halliday, Resnick, Walker",
    isbn: "978-1119460138",
    genre: "Physics",
    cover: "📘",
    rating: 4.3,
    totalCopies: 12,
    availableCopies: 6,
    shelf: "PHY-101",
    description:
      "Classic physics textbook covering mechanics, electromagnetism, thermodynamics, and modern physics.",
    pages: 1472,
    published: "2018",
    language: "English",
    edition: "11th Edition",
    tags: ["Physics", "Textbook", "Fundamentals"],
    waitlist: 0,
    popularity: 78,
  },
  {
    id: "b-8",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441013593",
    genre: "Science Fiction",
    cover: "📙",
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 2,
    shelf: "LIT-401",
    description:
      "Epic science fiction masterpiece about politics, religion, and ecology on the desert planet Arrakis.",
    pages: 688,
    published: "1965",
    language: "English",
    edition: "Anniversary Edition",
    tags: ["Sci-Fi", "Classic", "Politics"],
    waitlist: 1,
    popularity: 92,
  },
  {
    id: "b-9",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    isbn: "978-0984782857",
    genre: "Computer Science",
    cover: "📕",
    rating: 4.6,
    totalCopies: 10,
    availableCopies: 4,
    shelf: "CS-104",
    description:
      "189 programming questions and solutions with detailed explanations for technical interview preparation.",
    pages: 706,
    published: "2015",
    language: "English",
    edition: "6th Edition",
    tags: ["Interview", "Coding", "Career"],
    waitlist: 0,
    popularity: 97,
  },
  {
    id: "b-10",
    title: "Zero to One",
    author: "Peter Thiel",
    isbn: "978-0804139298",
    genre: "Business",
    cover: "📗",
    rating: 4.2,
    totalCopies: 4,
    availableCopies: 3,
    shelf: "BUS-301",
    description:
      "Notes on startups, or how to build the future — contrarian thinking for creating something new.",
    pages: 224,
    published: "2014",
    language: "English",
    edition: "1st Edition",
    tags: ["Startup", "Innovation", "Business"],
    waitlist: 0,
    popularity: 80,
  },
  {
    id: "b-11",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    genre: "History",
    cover: "📘",
    rating: 4.5,
    totalCopies: 6,
    availableCopies: 1,
    shelf: "HIS-201",
    description:
      "Bold narrative of humanity's creation and evolution — from the Stone Age to the Silicon Age.",
    pages: 464,
    published: "2015",
    language: "English",
    edition: "1st Edition",
    tags: ["History", "Anthropology", "Non-Fiction"],
    waitlist: 3,
    popularity: 87,
  },
  {
    id: "b-12",
    title: "System Design Interview Vol. 2",
    author: "Alex Xu",
    isbn: "978-1736049129",
    genre: "Computer Science",
    cover: "📙",
    rating: 4.8,
    totalCopies: 7,
    availableCopies: 0,
    shelf: "CS-206",
    description:
      "A software engineer's guide to system design interviews — with real-world case studies and diagrams.",
    pages: 436,
    published: "2022",
    language: "English",
    edition: "1st Edition",
    tags: ["System Design", "Interview", "Architecture"],
    waitlist: 6,
    popularity: 96,
  },
];

const SAMPLE_RESERVATIONS: Reservation[] = [
  { bookId: "b-1", bookTitle: "Introduction to Algorithms (CLRS)", reservedDate: "2026-08-15", dueDate: "2026-09-15", status: "active", renewable: true },
  { bookId: "b-9", bookTitle: "Cracking the Coding Interview", reservedDate: "2026-08-20", dueDate: "2026-08-28", status: "overdue", renewable: false },
  { bookId: "b-4", bookTitle: "Clean Code", reservedDate: "2026-07-10", dueDate: "2026-08-10", status: "returned", renewable: false },
  { bookId: "b-5", bookTitle: "The Pragmatic Programmer", reservedDate: "2026-08-25", dueDate: "2026-09-25", status: "pending", renewable: false },
];

const READING_LISTS: ReadingList[] = [
  { id: "rl-1", name: "Interview Prep", books: ["b-1", "b-9", "b-12", "b-5"], created: "2026-08-01" },
  { id: "rl-2", name: "CS Fundamentals", books: ["b-1", "b-2", "b-4", "b-5"], created: "2026-07-15" },
  { id: "rl-3", name: "Leisure Reading", books: ["b-8", "b-11", "b-10"], created: "2026-06-20" },
];

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  active: { color: "bg-emerald-500/20 text-emerald-400", label: "Active", icon: "✅" },
  overdue: { color: "bg-red-500/20 text-red-400", label: "Overdue", icon: "🔴" },
  returned: { color: "bg-gray-500/20 text-gray-400", label: "Returned", icon: "⬜" },
  pending: { color: "bg-amber-500/20 text-amber-400", label: "Pending", icon: "🟡" },
};

// ─── Main Component ─────────────────────────────────────────
export default function LibraryBookFinder() {
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterAvail, setFilterAvail] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "popularity" | "title">("popularity");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "reservations" | "lists">("browse");
  const [savedBooks, setSavedBooks] = useState<Set<string>>(new Set());
  const [showReserveDialog, setShowReserveDialog] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    return BOOKS.filter((b) => {
      if (
        search &&
        !b.title.toLowerCase().includes(search.toLowerCase()) &&
        !b.author.toLowerCase().includes(search.toLowerCase()) &&
        !b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      if (filterGenre !== "All" && b.genre !== filterGenre) return false;
      if (filterAvail && b.availableCopies === 0) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      return a.title.localeCompare(b.title);
    });
  }, [search, filterGenre, filterAvail, sortBy]);

  const totalBooks = BOOKS.length;
  const totalAvailable = BOOKS.reduce((s, b) => s + b.availableCopies, 0);
  const totalCopies = BOOKS.reduce((s, b) => s + b.totalCopies, 0);
  const overdueCount = SAMPLE_RESERVATIONS.filter((r) => r.status === "overdue").length;

  const toggleSave = (bookId: string) => {
    setSavedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  };

  return (
    <SiteShell>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/20">
              <BookOpen size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Library Book Finder
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Search the catalog, reserve books, manage due dates & reading lists
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <BookOpen size={20} />, label: "Total Books", value: `${totalBooks}`, sub: `${totalCopies} copies`, color: "bg-amber-500/20" },
              { icon: <CheckCircle size={20} />, label: "Available", value: `${totalAvailable}`, sub: `${Math.round((totalAvailable / totalCopies) * 100)}% of collection`, color: "bg-emerald-500/20" },
              { icon: <Bookmark size={20} />, label: "My Reservations", value: `${SAMPLE_RESERVATIONS.filter((r) => r.status !== "returned").length}`, sub: `${overdueCount} overdue`, color: "bg-blue-500/20" },
              { icon: <Award size={20} />, label: "Reading Lists", value: `${READING_LISTS.length}`, sub: `${READING_LISTS.reduce((s, l) => s + l.books.length, 0)} books saved`, color: "bg-purple-500/20" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>{s.icon}</div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</span>
                </div>
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "browse" as const, icon: <Search size={16} />, label: "Browse Catalog" },
              { id: "reservations" as const, icon: <Clock size={16} />, label: "My Reservations" },
              { id: "lists" as const, icon: <Bookmark size={16} />, label: "Reading Lists" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* ── Browse Tab ── */}
          {activeTab === "browse" && (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by title, author, or tag..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none">
                    {GENRES.map((g) => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                  </select>
                  <button
                    onClick={() => setFilterAvail(!filterAvail)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filterAvail ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                  >
                    Available Only
                  </button>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none">
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="title">A-Z</option>
                  </select>
                </div>
              </div>

              {/* Book Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-amber-500/20 transition-all cursor-pointer group"
                    onClick={() => setSelectedBook(b)}
                  >
                    <div className="flex gap-4 mb-3">
                      <div className="w-16 h-20 rounded-lg bg-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                        {b.cover}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {b.availableCopies > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              {b.availableCopies} Available
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">
                              Waitlist ({b.waitlist})
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500">{b.genre}</span>
                        </div>
                        <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors truncate">
                          {b.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{b.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            <span className="text-xs font-bold">{b.rating}</span>
                          </div>
                          <span className="text-[10px] text-gray-600">·</span>
                          <span className="text-[10px] text-gray-500">Shelf {b.shelf}</span>
                          <span className="text-[10px] text-gray-600">·</span>
                          <span className="text-[10px] text-gray-500">{b.pages}p</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {b.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: b.totalCopies }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < b.availableCopies ? "bg-emerald-400" : "bg-gray-700"}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSave(b.id); }}
                          className={`p-1.5 rounded-lg transition-all ${savedBooks.has(b.id) ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-gray-500 hover:text-white"}`}
                        >
                          <Bookmark size={14} className={savedBooks.has(b.id) ? "fill-current" : ""} />
                        </button>
                        <Button
                          size="sm"
                          className={`text-xs font-semibold ${b.availableCopies > 0 ? "bg-amber-600 hover:bg-amber-500" : "bg-white/10 text-gray-400"}`}
                          onClick={(e) => { e.stopPropagation(); if (b.availableCopies > 0) setShowReserveDialog(b); }}
                        >
                          {b.availableCopies > 0 ? "Reserve" : "Join Waitlist"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg font-semibold">No books found</p>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}
            </>
          )}

          {/* ── Reservations Tab ── */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock size={20} className="text-amber-400" /> My Reservations
              </h2>
              {SAMPLE_RESERVATIONS.map((r, i) => {
                const sc = STATUS_CONFIG[r.status];
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${sc.color}`}>
                          {sc.icon} {sc.label}
                        </span>
                        {r.renewable && r.status === "active" && (
                          <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            <RefreshCw size={12} /> Renew
                          </button>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-white mb-2">{r.bookTitle}</h3>
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12} />Reserved: {r.reservedDate}</span>
                      <span className="flex items-center gap-1">
                        {r.status === "overdue" ? (
                          <><AlertTriangle size={12} className="text-red-400" /><span className="text-red-400 font-semibold">Due: {r.dueDate}</span></>
                        ) : (
                          <><Clock size={12} />Due: {r.dueDate}</>
                        )}
                      </span>
                    </div>
                    {r.status === "overdue" && (
                      <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-xs text-red-300">
                        ⚠️ This book is overdue. Please return it as soon as possible to avoid fines.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Reading Lists Tab ── */}
          {activeTab === "lists" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bookmark size={20} className="text-purple-400" /> My Reading Lists
              </h2>
              {READING_LISTS.map((list) => (
                <div key={list.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{list.name}</h3>
                      <span className="text-[10px] text-gray-500">Created {list.created}</span>
                    </div>
                    <span className="text-xs text-gray-400">{list.books.length} books</span>
                  </div>
                  <div className="space-y-2">
                    {list.books.map((bookId) => {
                      const book = BOOKS.find((b) => b.id === bookId);
                      if (!book) return null;
                      return (
                        <div key={bookId} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={() => setSelectedBook(book)}>
                          <span className="text-xl">{book.cover}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">{book.title}</div>
                            <div className="text-[10px] text-gray-500">{book.author}</div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            <span className="text-xs font-bold">{book.rating}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${book.availableCopies > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                            {book.availableCopies > 0 ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Detail Modal */}
        {selectedBook && (
          <Dialog open={true} onOpenChange={(open) => !open && setSelectedBook(null)}>
            <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedBook.cover}</span>
                  <div>
                    <DialogTitle className="text-xl font-black">{selectedBook.title}</DialogTitle>
                    <DialogDescription className="text-gray-400">{selectedBook.author}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-300">{selectedBook.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Rating", value: `⭐ ${selectedBook.rating}`, color: "text-amber-400" },
                    { label: "Pages", value: `${selectedBook.pages}`, color: "text-blue-400" },
                    { label: "Edition", value: selectedBook.edition, color: "text-purple-400" },
                    { label: "Shelf", value: selectedBook.shelf, color: "text-emerald-400" },
                    { label: "ISBN", value: selectedBook.isbn, color: "text-gray-300" },
                    { label: "Published", value: selectedBook.published, color: "text-gray-300" },
                    { label: "Language", value: selectedBook.language, color: "text-gray-300" },
                    { label: "Genre", value: selectedBook.genre, color: "text-gray-300" },
                  ].map((info, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-[10px] text-gray-500 uppercase">{info.label}</div>
                      <div className={`text-sm font-semibold ${info.color}`}>{info.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.tags.map((tag) => (
                    <span key={tag} className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-sm text-gray-400">Availability</div>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: selectedBook.totalCopies }, (_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i < selectedBook.availableCopies ? "bg-emerald-400" : "bg-gray-700"}`} />
                      ))}
                      <span className="text-sm font-semibold text-white">{selectedBook.availableCopies}/{selectedBook.totalCopies}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white" onClick={() => toggleSave(selectedBook.id)}>
                      <Bookmark size={14} className={savedBooks.has(selectedBook.id) ? "fill-current text-amber-400" : ""} />
                    </Button>
                    <Button
                      className={`font-semibold ${selectedBook.availableCopies > 0 ? "bg-amber-600 hover:bg-amber-500" : "bg-white/10 text-gray-400"}`}
                      onClick={() => { if (selectedBook.availableCopies > 0) { setShowReserveDialog(selectedBook); setSelectedBook(null); } }}
                    >
                      {selectedBook.availableCopies > 0 ? "Reserve Now" : "Join Waitlist"}
                      <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reserve Confirmation */}
        {showReserveDialog && (
          <Dialog open={true} onOpenChange={(open) => !open && setShowReserveDialog(null)}>
            <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-black">Reserve Book</DialogTitle>
                <DialogDescription className="text-gray-400">Confirm your reservation</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                  <span className="text-3xl">{showReserveDialog.cover}</span>
                  <div>
                    <div className="font-bold text-white">{showReserveDialog.title}</div>
                    <div className="text-xs text-gray-400">{showReserveDialog.author}</div>
                    <div className="text-xs text-gray-500 mt-1">Shelf: {showReserveDialog.shelf}</div>
                  </div>
                </div>
                <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">Reservation Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Duration:</span> <span className="text-white">30 days</span></div>
                    <div><span className="text-gray-500">Pickup:</span> <span className="text-white">Front Desk</span></div>
                    <div><span className="text-gray-500">Fine:</span> <span className="text-white">₹5/day late</span></div>
                    <div><span className="text-gray-500">Renewals:</span> <span className="text-white">Up to 2x</span></div>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold" onClick={() => setShowReserveDialog(null)}>
                  Confirm Reservation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-12 text-center text-xs text-gray-600 pb-8">
          Campus Library — {totalBooks} titles across {GENRES.length - 1} departments 📚
        </div>
      </div>
    </SiteShell>
  );
}
