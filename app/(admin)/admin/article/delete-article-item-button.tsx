'use client';

import React from 'react';

import { type Article } from '@prisma/client';
import { TrashIcon } from '@radix-ui/react-icons';
import { AlertDialog, Button, Flex, IconButton } from '@radix-ui/themes';

import { deleteArticle } from '@/app/_actions/article';

type Props = {
  article: Article;
};

export function DeleteArticleItemButton({ article }: Props) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <IconButton color="red">
          <TrashIcon />
        </IconButton>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>删除文章</AlertDialog.Title>
        <AlertDialog.Description>确定要删除该文章吗？</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              取消
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              onClick={async () => {
                await deleteArticle(article.id);
              }}
            >
              删除
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}