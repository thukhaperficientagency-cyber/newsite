import { useState } from "react";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { Plus, Trash2 } from "lucide-react";
import { db, uploadImage } from "../lib/firebase";
import { ServicePillar } from "../types";

interface ServiceAdminProps {
  services: ServicePillar[];
  setServices: (services: ServicePillar[]) => void;
  showToast: (message: string, isError?: boolean) => void;
}

const emptyService = (order: number): ServicePillar => ({
  id: `service-${Date.now()}`,
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  benefits: [],
  process: [],
  faqs: [],
  seoTitle: "",
  seoDescription: "",
  keywords: [],
  order,
  status: "published"
});

export default function ServiceAdmin({
  services,
  setServices,
  showToast
}: ServiceAdminProps) {
  const [form, setForm] = useState<ServicePillar | null>(null);
  const [benefits, setBenefits] = useState("");
  const [process, setProcess] = useState("");
  const [keywords, setKeywords] = useState("");
  const [faqs, setFaqs] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const editService = (service: ServicePillar) => {
    setForm({ ...service });
    setBenefits(service.benefits?.join("\n") || "");
    setProcess(service.process?.join("\n") || "");
    setKeywords(service.keywords?.join(", ") || "");
    setFaqs(
      service.faqs
        ?.map((faq) => `${faq.question} | ${faq.answer}`)
        .join("\n") || ""
    );
  };

  const addService = () => {
    const service = emptyService(services.length + 1);
    setForm(service);
    setBenefits("");
    setProcess("");
    setKeywords("");
    setFaqs("");
  };

  const saveService = async () => {
    if (!form?.title || !form.slug || !form.shortDescription || !form.description) {
      showToast("Service title, slug, summary and description are required.", true);
      return;
    }

    const normalizedSlug = form.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const saved: ServicePillar = {
      ...form,
      id: normalizedSlug,
      slug: normalizedSlug,
      benefits: benefits.split("\n").map((item) => item.trim()).filter(Boolean),
      process: process.split("\n").map((item) => item.trim()).filter(Boolean),
      keywords: keywords.split(",").map((item) => item.trim()).filter(Boolean),
      faqs: faqs
        .split("\n")
        .map((line) => {
          const [question, ...answerParts] = line.split("|");
          return {
            question: question?.trim(),
            answer: answerParts.join("|").trim()
          };
        })
        .filter((faq) => faq.question && faq.answer)
    };

    try {
      await setDoc(doc(db, "services", saved.id), saved);
      const exists = services.some((service) => service.id === saved.id);
      setServices(
        exists
          ? services.map((service) => service.id === saved.id ? saved : service)
          : [...services, saved]
      );
      setForm(null);
      showToast("Service pillar saved.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Service save failed.", true);
    }
  };

  const removeService = async (id: string) => {
    if (!confirm("Delete this service pillar?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      setServices(services.filter((service) => service.id !== id));
      showToast("Service pillar deleted.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Delete failed.", true);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Service Pillar Pages</h2>
          <p className="text-xs text-gray-500 mt-1">
            Dedicated SEO pages connected to related blog articles.
          </p>
        </div>
        <button onClick={addService} className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 rounded-lg text-xs font-semibold">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {form && (
        <div className="bg-[#0b0e15] border border-gray-800 rounded-xl p-5 mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className={inputClass} placeholder="URL slug: digital-marketing-myanmar" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <textarea className={inputClass} rows={2} placeholder="Short card description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          <textarea className={inputClass} rows={6} placeholder="Full pillar page description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <input
              className={inputClass}
              placeholder="Hero image URL"
              value={form.heroImageUrl || ""}
              onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
            />
            <label className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs cursor-pointer text-center">
              {isUploading ? "Uploading..." : "Upload Hero"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    const imageUrl = await uploadImage(file, "services");
                    setForm({ ...form, heroImageUrl: imageUrl });
                  } catch (error) {
                    showToast(error instanceof Error ? error.message : "Upload failed.", true);
                  } finally {
                    setIsUploading(false);
                    event.target.value = "";
                  }
                }}
              />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea className={inputClass} rows={5} placeholder="Benefits — one per line" value={benefits} onChange={(e) => setBenefits(e.target.value)} />
            <textarea className={inputClass} rows={5} placeholder="Process steps — one per line" value={process} onChange={(e) => setProcess(e.target.value)} />
          </div>
          <textarea className={inputClass} rows={4} placeholder="FAQs — Question | Answer, one per line" value={faqs} onChange={(e) => setFaqs(e.target.value)} />
          <div className="grid md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="SEO title" value={form.seoTitle || ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            <input className={inputClass} placeholder="Keywords, comma separated" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
          <textarea className={inputClass} rows={2} placeholder="SEO meta description" value={form.seoDescription || ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input className={inputClass} type="number" placeholder="Order" value={form.order || 1} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={saveService} className="flex-1 py-3 bg-indigo-600 rounded-lg text-xs font-semibold">Save Service</button>
            <button onClick={() => setForm(null)} className="px-5 py-3 border border-gray-700 rounded-lg text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {[...services].sort((a, b) => (a.order || 99) - (b.order || 99)).map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 bg-[#0a0d15] rounded-xl border border-gray-900">
            <div>
              <p className="text-sm font-semibold text-white">{service.title}</p>
              <p className="text-[10px] text-gray-500 font-mono">/services/{service.slug} · {service.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editService(service)} className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded text-xs">Edit</button>
              <button onClick={() => removeService(service.id)} className="p-2 bg-red-950/40 text-red-400 rounded"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
