import logoAsset from "@/assets/snapcut-logo.png.asset.json";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="SnapCut AI logo"
      className={`${className} rounded-xl object-cover`}
    />
  );
}
