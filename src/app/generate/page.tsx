"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import Flashcard from "@/components/Flashcard/Flashcard";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { samplePrompts } from "@/constants/sample-prompts";

export default function Generate() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<
    { front: string; back: string }[]
  >([]);
  const [deckName, setDeckName] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { userInfo, updateUserInfo } = useAuth();

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const saveFlashcards = async () => {
    if (!deckName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    if (!userInfo) {
      alert("Please sign in to save flashcards.");
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(collection(db, "users"), userInfo.id);
      const batch = writeBatch(db);
      // const userDocSnap = await getDoc(userDocRef);

      // if (!userDocSnap.exists()) return alert("user not found");

      // const userData = userDocSnap.data();
      const updatedSets = [
        ...(userInfo.flashcardSets || []),
        { name: deckName },
      ];
      batch.update(userDocRef, { flashcardSets: updatedSets });

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), deckName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();
      setLoading(false);
      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setDeckName("");
      updateUserInfo({ ...userInfo, flashcardSets: updatedSets });
    } catch (error) {
      console.error("Error saving flashcards:", error);
      setLoading(false);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    if (loading) return;

    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw server response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Failed to parse server response");
      }
      setLoading(false);
      setFlashcards(data);
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      setLoading(false);
      alert(
        error.message ||
          "An error occurred while generating flashcards. Please try again.",
      );
    }
  };

  return (
    <section id="result" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container min-h-96">
        <Container
          maxWidth="lg"
          className="mt-5 flex flex-wrap justify-between gap-5"
        >
          <div className="min-w-screen w-full md:w-3/5 md:min-w-64">
            <Box>
              {/* <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography> */}
              <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: "white" },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                }}
              />
              <button
                className="border-stroke mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={10} />
                ) : (
                  "Generate Flashcards"
                )}
              </button>
            </Box>

            {flashcards.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Generated Flashcards
                </Typography>
                <Grid container>
                  {flashcards.map((flashcard, index) => (
                    <div
                      key={index}
                      className="w-full p-2 md:w-2/3 lg:w-1/2 xl:w-1/3"
                    >
                      <Flashcard
                        front={flashcard.front}
                        back={flashcard.back}
                      />
                    </div>
                  ))}
                </Grid>
              </Box>
            )}
            {flashcards.length > 0 && (
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                >
                  Save Flashcards
                </Button>
              </Box>
            )}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Save Flashcard Set</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter a name for your flashcard deck
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Set Name"
                  type="text"
                  fullWidth
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={saveFlashcards} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div className="mb-10 rounded-sm bg-white shadow-three dark:bg-gray-dark dark:shadow-none">
            <h3 className="border-b border-body-color border-opacity-10 px-8 py-4 text-lg font-semibold text-black dark:border-white dark:border-opacity-10 dark:text-white">
              Sample Prompts
            </h3>
            <ul className="p-8">
              {samplePrompts.map((prompt, index) => (
                <li
                  key={index}
                  className="mb-6 cursor-pointer border-b border-body-color border-opacity-10 pb-6 dark:border-white dark:border-opacity-10"
                  onClick={() => {
                    setText(prompt);
                  }}
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
