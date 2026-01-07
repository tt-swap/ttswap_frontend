import { TokenProfile } from "@/components/business/TokenProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGoodId } from "@/stores/valueGood";

interface TokenDetailPageProps {
  tokenData: any;
}

export default function TokenDetailPage() {
  const { tokens_id } = useParams<{ tokens_id: string }>();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };


  const { setGoodId } = useGoodId();

  useEffect(() => {
    setGoodId({
      swap: { id: tokens_id },
      invest: { id: tokens_id }
    })
  }, [tokens_id]);

  return (
    <div className="relative">

      <TokenProfile
        handleBack={handleBack}
        tokenId={tokens_id}
      />
    </div>
  );
}
