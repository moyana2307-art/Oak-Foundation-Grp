export type PartnerProfile = {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  region: string;
  kind: string;
  focus: string;
  since: number;
  website: string;
  contactName: string;
  contactEmail: string;
  description: string;
};

export const PARTNERS: PartnerProfile[] = [
  {
    id: "open-society-foundations",
    name: "Open Society Foundations",
    shortName: "OSF",
    acronym: "OSF",
    region: "Global",
    kind: "Foundation",
    focus: "Democracy · Human Rights",
    since: 2018,
    website: "opensocietyfoundations.org",
    contactName: "Maria Schmidt",
    contactEmail: "mschmidt@osf.org",
    description:
      "Open Society Foundations builds vibrant and tolerant democracies. OAK partnership covers digital rights and justice initiatives across Eastern Europe and Central Asia.",
  },
  {
    id: "africa-climate-alliance",
    name: "Africa Climate Alliance",
    shortName: "ACA",
    acronym: "ACA",
    region: "Sub-Saharan Africa",
    kind: "NGO",
    focus: "Climate Justice · Youth",
    since: 2018,
    website: "africaclimatealliance.org",
    contactName: "Samuel Okafor",
    contactEmail: "samuel@africaclimatealliance.org",
    description:
      "A pan-African movement of youth-led climate justice organisations driving equitable climate finance and just transitions across the continent.",
  },
  {
    id: "nordic-evaluation-centre",
    name: "Nordic Evaluation Centre",
    shortName: "NEC",
    acronym: "NEC",
    region: "Europe",
    kind: "NGO",
    focus: "Evaluation",
    since: 2017,
    website: "nordicevaluation.org",
    contactName: "Dr Ingrid Holm",
    contactEmail: "i.holm@nordicevaluation.org",
    description:
      "Specialists in monitoring, evaluation and learning for the social and philanthropic sectors, supporting evidence-driven grantmaking.",
  },
  {
    id: "mena-rights-group",
    name: "MENA Rights Group",
    shortName: "MRG",
    acronym: "MRG",
    region: "Middle East & North Africa",
    kind: "NGO",
    focus: "Human Rights",
    since: 2019,
    website: "menarights.org",
    contactName: "Fatima Zahra Benali",
    contactEmail: "f.benali@menarights.org",
    description:
      "Advancing civic space, freedom of expression and human rights defenders across the Middle East and North Africa region.",
  },
  {
    id: "digital-frontiers-institute",
    name: "Digital Frontiers Institute",
    shortName: "DFI",
    acronym: "DFI",
    region: "Global Africa",
    kind: "Research",
    focus: "Digital Rights · Internet Freedom",
    since: 2022,
    website: "digitalfrontiersinstitute.org",
    contactName: "Li Wei",
    contactEmail: "li.wei@digitalfrontiersinstitute.org",
    description:
      "Research hub examining digital rights, platform governance and internet freedom in emerging markets and the Global South.",
  },
  {
    id: "global-advocacy-lab",
    name: "Global Advocacy Lab",
    shortName: "GAL",
    acronym: "GAL",
    region: "Global",
    kind: "NGO",
    focus: "Advocacy",
    since: 2023,
    website: "globaladvocacylab.org",
    contactName: "Partner contact",
    contactEmail: "contact@globaladvocacylab.org",
    description:
      "A laboratory for advocacy strategy, experimentation and coalition building across international policy fields.",
  },
  {
    id: "sciences-po-paris",
    name: "Sciences Po Paris",
    shortName: "SPP",
    acronym: "SPP",
    region: "Western Europe",
    kind: "Academic",
    focus: "Policy Research",
    since: 2020,
    website: "sciencespo.fr",
    contactName: "Partner contact",
    contactEmail: "coordination@sciencespo.fr",
    description:
      "One of Europe's leading institutions in the social sciences, contributing research and talent on public policy and democracy.",
  },
  {
    id: "environmental-funders-group",
    name: "Environmental Funders Group",
    shortName: "EFG",
    acronym: "EFG",
    region: "Europe",
    kind: "Funders Network",
    focus: "Climate",
    since: 2017,
    website: "envfunders.eu",
    contactName: "Partner contact",
    contactEmail: "climate@envfunders.eu",
    description:
      "A peer network of funders investing in European climate action, environmental justice and the grantmaking ecosystem.",
  },
];

export const PARTNER_REGIONS = [
  "All",
  "Sub-Saharan Africa",
  "Europe",
  "Western Europe",
  "Global",
  "Global Africa",
  "Middle East & North Africa",
];