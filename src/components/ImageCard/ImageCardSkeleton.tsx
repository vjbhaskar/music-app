import { Card, CardContent, Skeleton } from "@mui/material";

const ImageCardSkeleton = () => {
  return (
    <Card>
      <Skeleton variant="rectangular" width={200} height={275} />
      <CardContent>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </CardContent>
    </Card>
  );
};

export default ImageCardSkeleton;
