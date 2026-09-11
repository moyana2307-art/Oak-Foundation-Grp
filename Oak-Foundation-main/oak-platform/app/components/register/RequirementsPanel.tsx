import { whiteInputBase } from "./inputStyles";

type RequirementsPanelProps = {
  dietary: string;
  accessibility: string;
  travel: string;
  onChangeDietary: (value: string) => void;
  onChangeAccessibility: (value: string) => void;
  onChangeTravel: (value: string) => void;
};

export default function RequirementsPanel({
  dietary,
  accessibility,
  travel,
  onChangeDietary,
  onChangeAccessibility,
  onChangeTravel,
}: RequirementsPanelProps) {
  return (
    <div className="rounded-[20px] border border-[#E3E8F0] bg-[#F2F5F9] p-4">
      <h3 className="mb-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#5B6B84]">
        Requirements
      </h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="dietary"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6B84]"
          >
            Dietary Requirements
          </label>
          <input
            type="text"
            id="dietary"
            name="dietary"
            value={dietary}
            onChange={(e) => onChangeDietary(e.target.value)}
            placeholder="e.g. Vegetarian, Halal, Gluten-free"
            className={whiteInputBase}
          />
        </div>

        <div>
          <label
            htmlFor="accessibility"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6B84]"
          >
            Accessibility Requirements
          </label>
          <input
            type="text"
            id="accessibility"
            name="accessibility"
            value={accessibility}
            onChange={(e) => onChangeAccessibility(e.target.value)}
            placeholder="e.g. Wheelchair access, hearing loop"
            className={whiteInputBase}
          />
        </div>

        <div>
          <label
            htmlFor="travel"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6B84]"
          >
            Travel &amp; Accommodation
          </label>
          <input
            type="text"
            id="travel"
            name="travel"
            value={travel}
            onChange={(e) => onChangeTravel(e.target.value)}
            placeholder="e.g. Flight from London, hotel needed"
            className={whiteInputBase}
          />
        </div>
      </div>
    </div>
  );
}