import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Scan,
  Zap,
  Wheat,
  Layers,
  Barcode,
  Boxes,
  Droplets,
  Search,
  ArrowRight,
  FlaskConical,
  Clock,
  Award,
} from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { PROBLEM_CATEGORIES } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function CategoriesSection() {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sectors = [
    { label: 'All Sectors', value: 'ALL' },
    { label: 'Precision Engineering', value: 'MANUFACTURING' },
    { label: 'Green Energy & Power', value: 'RENEWABLE_ENERGY' },
    { label: 'Food & Agro Processing', value: 'FOOD_PROCESSING' },
    { label: 'Textiles & Garments', value: 'TEXTILES' },
    { label: 'Software & Inventory', value: 'SOFTWARE_AI' },
    { label: 'Circular & Effluent', value: 'CIRCULAR_ECONOMY' },
  ];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return Activity;
      case 'Scan':
        return Scan;
      case 'Zap':
        return Zap;
      case 'Wheat':
        return Wheat;
      case 'Layers':
        return Layers;
      case 'Barcode':
        return Barcode;
      case 'Boxes':
        return Boxes;
      case 'Droplets':
        return Droplets;
      default:
        return Activity;
    }
  };

  const filteredCategories = PROBLEM_CATEGORIES.filter((cat) => {
    const matchesSector =
      selectedSector === 'ALL' || cat.sector === selectedSector;
    const matchesQuery =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.sampleChallenge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.associatedLab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesQuery;
  });

  return (
    <section id="industries" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Priority Industrial Domains"
          title="Catalogued Problem Categories &"
          highlight="Associated FXEC Laboratories"
          description="Browse documented technical bottlenecks across Southern Tamil Nadu's industrial clusters. Each category is mapped to a dedicated FXEC laboratory and faculty research division."
        />

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {sectors.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedSector(s.value)}
                className={cn(
                  'whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border',
                  selectedSector === s.value
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by keyword (e.g. downtime, solar, loom)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.iconName);
            return (
              <div
                key={cat.id}
                className="rounded-xl border border-slate-300 bg-white p-6 shadow-elevation hover:border-blue-900 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-md bg-slate-900 text-cyan-400 flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {cat.sector.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>

                  {/* Typical Bottlenecks */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Observed Bottlenecks:
                    </span>
                    <div className="space-y-1">
                      {cat.typicalBottlenecks.map((b, i) => (
                        <p key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-slate-400 shrink-0" />
                          <span>{b}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Associated Lab */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-blue-900 font-medium">
                    <FlaskConical className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                    <span className="truncate">{cat.associatedLab}</span>
                  </div>

                  {/* Turnaround & Scheme */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {cat.turnaroundEst}
                    </span>
                    {cat.recommendedScheme && (
                      <span className="text-emerald-700 font-bold">
                        {cat.recommendedScheme}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={`/submit-problem?sector=${cat.sector}&category=${encodeURIComponent(cat.name)}`}
                    className="w-full block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between text-xs font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 group"
                    >
                      <span>Submit Intake Under This Category</span>
                      <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
