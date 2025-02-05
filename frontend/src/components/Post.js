import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const Post = ({ post }) => (
    <Card sx={{ mb: 3 }}>
        <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography>{post.content}</Typography>
        </CardContent>
    </Card>
);

export default Post;
