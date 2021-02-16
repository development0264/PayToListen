import React, { FC } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface Props {
  handleEditorChange: (data: any) => void;
  content: string;
}

const ContentEditor: FC<Props> = ({
  handleEditorChange,
  content,
}: Props): JSX.Element => {
  return (
    <Editor
      initialValue={content}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect fontSelect | bold italic backcolor forecolor |  alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
      }}
      // inline
      onEditorChange={handleEditorChange}
    />
  );
};

export default ContentEditor;
