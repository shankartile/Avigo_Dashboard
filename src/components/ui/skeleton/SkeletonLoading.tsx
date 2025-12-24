import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonVariant = "card" | "table" | "profile" | "list";

interface SkeletonLoadingProps {
  variant?: SkeletonVariant;
  count?: number;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  variant = "card",
  count = 6,
}) => {
  const renderCardSkeleton = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
          <Skeleton height={150} />
          <div style={{ display: "flex", alignItems: "center", marginTop: 16, gap: 12 }}>
            <Skeleton circle height={50} width={50} />
            <Skeleton height={20} width="70%" />
          </div>
          <Skeleton height={15} width="60%" style={{ marginTop: 10 }} />
          <Skeleton height={10} width="90%" style={{ marginTop: 6 }} />
        </div>
      ))}
    </div>
  );

  const renderTableSkeleton = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i} style={{ padding: "12px" }}>
                <Skeleton height={20} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: count }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 5 }).map((_, j) => (
                <td key={j} style={{ padding: "12px" }}>
                  <Skeleton height={20} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Skeleton circle height={100} width={100} />
      <Skeleton height={30} width="60%" />
      <Skeleton height={20} width="40%" />
      <Skeleton height={15} width="80%" />
      <Skeleton height={15} width="90%" />
    </div>
  );

  const renderListSkeleton = () => (
    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <Skeleton circle height={40} width={40} />
          <Skeleton height={20} width="70%" />
        </li>
      ))}
    </ul>
  );

  const renderVariant = () => {
    switch (variant) {
      case "table":
        return renderTableSkeleton();
      case "profile":
        return renderProfileSkeleton();
      case "list":
        return renderListSkeleton();
      case "card":
      default:
        return renderCardSkeleton();
    }
  };

  return <section>{renderVariant()}</section>;
};

export default SkeletonLoading;
