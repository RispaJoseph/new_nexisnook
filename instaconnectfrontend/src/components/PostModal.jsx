import React, { useEffect, useState } from 'react';
import UpdatePostApi from '../api/UpdatePostApi';
import { toast } from 'react-toastify';
import createPostApi from '../api/createPostApi';
import { BASE_URL } from '../utils/constants';

const PostModal = ({ isVisible, onClose, postID, initialCaption, initialImage ,updateCaption , updatePostList}) => {
  const [postImage, setPostImage] = useState(initialImage || null);
  const [caption, setCaption] = useState(initialCaption || '');
  const [previewImageUrl, setPreviewImageUrl] = useState(initialImage || null);

  useEffect(() => {
    setPostImage(initialImage || null);
    setCaption(initialCaption || '');
    setPreviewImageUrl(initialImage || null);
  }, [isVisible, initialCaption, initialImage]);

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setPostImage(selectedImage);
    setPreviewImageUrl(URL.createObjectURL(selectedImage));
  };


  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postID) {
      try {
        onClose();
        await UpdatePostApi(postID, caption, postImage);
      
        // Call the updateCaption function with the new caption
        console.log('updateCaption', caption);
        updateCaption(postID, caption);
        setCaption('');
      
        toast.success('Post updated successfully', {
          position: 'top-center',
        });
      } catch (error) {
        console.error('Error updating post:', error);
      
        toast.error('Failure, Post not updated!', {
          position: 'top-center',
        });
      }
    } else {
      try {
        onClose();
        const newPostData = await createPostApi(caption, postImage);
        console.log('newpostdata after creation',newPostData)
        updatePostList()
        toast.success('Post Created successfully', {
          position: 'top-center',
        });
        setCaption('');
      } catch (error) {
        toast.error('Failure, Post not Created', {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <div
      className="z-50 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="m-2 w-[600px] flex flex-col">
        <button className="text-white text-xl place-self-end" onClick={onClose}>
          x
        </button>
        <div className="bg-white p-2 rounded">
          <form className="m-3" onSubmit={handleSubmit}>
            <label htmlFor="modal" className="flex justify-center font-bold">
              {postID ? 'Update Post' : 'Add Post'}
            </label>
            {!postID && (
              <div>
                <label
                  className="z-10 block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  htmlFor="file_input"
                >
                  Upload Image
                </label>
                <input
                  onChange={handleImageChange}
                  className="relative my-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-900 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-500 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                  type="file"
                  id="formFile"
                />
              </div>
            )}

            {postImage && (
            <div className="shrink-0 flex justify-center">
                {previewImageUrl && (
                <img
                    id="preview_img"
                    className="w-80 object-cover rounded-lg my-2"
                    src={
                    previewImageUrl.startsWith('http://127.0.0.1:8000')
                        ? previewImageUrl
                        : postID
                        ? `${BASE_URL}${postImage}`
                        : previewImageUrl
                    }
                    alt="Current"
                />
                )}
            </div>
            )}

            <div className="relative my-5" data-te-input-wrapper-init>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="peer block min-h-[auto] w-full rounded border-0 bg-primary-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear text-dark placeholder-neutral-400 placeholder-opacity-70 focus:placeholder-opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder-opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder-opacity-0"
                placeholder="Write Caption"
              />
              {!postID && (
                <label
                  htmlFor="exampleFormControlInpu3"
                  className="pointer-events-none text-gray-900 absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-500 dark:peer-focus:text-primary"
                >
                  Write Something..
                </label>
              )}
            </div>
            <button
              type="submit"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-flex items-center rounded bg-gray-600 px-6 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              <span className="flex-shrink-0">Done</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;