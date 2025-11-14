import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import type { Album } from "../../types/types";
import styles from "./ImageCard.module.css";
import getCroppedImageUrl from "../../services/image-url";
import ShopIcon from "@mui/icons-material/Shop";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";

interface ImageCardProps {
  cardData: Album;
}

const ImageCard = ({ cardData }: ImageCardProps) => {
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  return (
    <Card
      sx={{
        maxWidth: 200,
        height: 275,
        transition: "0.3s",
        boxShadow: 1,
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: 150, width: 200, objectFit: "cover" }}
        image={getCroppedImageUrl(cardData.image, 200, 150)}
      />
      <CardContent sx={{ padding: 1.25, pb: 0 }}>
        <Grid>
          <Box>
            <Grid size={12}>
              <Typography
                className={styles.infoText}
                variant={"subtitle1"}
                title={cardData.name}
                gutterBottom
                sx={{
                  fontWeight: 500,
                }}
              >
                {cardData.name}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography
                className={styles.infoText}
                title={cardData.artist}
                variant={"subtitle2"}
                gutterBottom
                sx={{
                  fontWeight: 300,
                }}
              >
                {cardData.artist}
              </Typography>
            </Grid>
          </Box>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Grid>
          <IconButton
            title="Favourite"
            onClick={() => setIsFavourite(!isFavourite)}
          >
            {isFavourite ? (
              <Favorite sx={{ color: "red" }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Grid>
        <Grid sx={{ justifyContent: "flex-end" }}>
          <Typography variant="caption"> {cardData.price} </Typography>
          <IconButton
            title="Buy on Itunes"
            onClick={() =>
              window.open(cardData.url, "_blank", "noopener,noreferrer")
            }
          >
            <ShopIcon />
          </IconButton>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ImageCard;
