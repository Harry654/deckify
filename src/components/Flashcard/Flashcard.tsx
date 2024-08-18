import { Box, Card, CardContent, Typography } from "@mui/material";
import { useCallback, useState } from "react";

export default function Flashcard(props: { front: string; back: string }) {
  const { front, back } = props;

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const flip = useCallback(() => setIsFlipped(!isFlipped), [isFlipped]);

  return (
    <Card
      sx={{
        cursor: "pointer",
        perspective: "1000px", // Added for better 3D effect
        width: "100%",
        height: "200px", // Adjust as needed
      }}
      onClick={flip}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of the card */}
        <CardContent
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "gray",
            borderRadius: "4px", // Add border radius if needed
            boxShadow: isFlipped ? "none" : "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6">Question</Typography>
          <Typography>{front}</Typography>
        </CardContent>
        {/* Back of the card */}
        <CardContent
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            transform: "rotateY(180deg)",
            borderRadius: "4px", // Add border radius if needed
            boxShadow: isFlipped ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          <Typography variant="h6">Answer:</Typography>
          <Typography>{back}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
