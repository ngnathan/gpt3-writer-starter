import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const maxWords = 8000;

const Home = () => {
	const [podcastTitle, setPodcastTitle] = useState('');
	const [episodeTitle, setEpisodeTitle] = useState('');
	const [transcript, setTranscript] = useState('');
	const [apiOutput, setApiOutput] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);

	const callGenerateEndpoint = async () => {
		setIsGenerating(true);

		console.log('Calling OpenAI...');
		const response = await fetch('/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ podcastTitle, episodeTitle, transcript })
		});

		const data = await response.json();
		const { output } = data;
		console.log('OpenAI replied...', output.text);

		setApiOutput(`${output.text}`);
		setIsGenerating(false);
	};

	const handlePodcastTitleChange = (event) => {
		setPodcastTitle(event.target.value);
	};

	const handlePodcastEpisodeTitleChange = (event) => {
		setEpisodeTitle(event.target.value);
	};

	const handlePodcastTranscriptChange = (event) => {
		setTranscript(event.target.value);
	};

	const wordsRemaining = maxWords - transcript.split(' ').length;

	return (
		<div className='root'>
			<Head>
				<title>GPT-3 Writer | buildspace</title>
			</Head>
			<div className='container'>
				<div className='header'>
					<div className='header-title'>
						<h1>The ultimate podcast summarizer</h1>
					</div>
					<div className='header-subtitle'>
						<h2>Paste in the transcription of your favorite podcast and generate an automated summary.</h2>
						<p>
							Note: Due to API costs and limitations, the transcript is limited to 8000 words. (Roughly 30-40 minutes of
							conversation.)
						</p>
					</div>
				</div>
				<div className='prompt-container'>
					<input
						className='prompt-title'
						placeholder='Enter in the name of the podcast'
						value={podcastTitle}
						onChange={handlePodcastTitleChange}
					/>
					<input
						className='prompt-title'
						placeholder='Enter in the name of the episode'
						value={episodeTitle}
						onChange={handlePodcastEpisodeTitleChange}
					/>
					<textarea
						className='prompt-box'
						placeholder='Paste your podcast transcription here'
						value={transcript}
						onChange={handlePodcastTranscriptChange}
					/>
					<div className='prompt-buttons'>
						<span className='prompt-length'>{transcript ? wordsRemaining : ''}</span>
					</div>
					<div className='prompt-buttons'>
						<a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
							<div className='generate'>{isGenerating ? <span class='loader'></span> : <p>Generate</p>}</div>
						</a>
					</div>
				</div>
			</div>
			{apiOutput && (
				<div className='output'>
					<div className='output-header-container'>
						<div className='output-header'>
							<h3>Output</h3>
						</div>
					</div>
					<div className='output-content'>
						<p>{apiOutput}</p>
					</div>
				</div>
			)}
			<div className='badge-container grow'>
				<a href='https://buildspace.so/builds/ai-writer' target='_blank' rel='noreferrer'>
					<div className='badge'>
						<Image src={buildspaceLogo} alt='buildspace logo' />
						<p>build with buildspace</p>
					</div>
				</a>
			</div>
		</div>
	);
};

export default Home;
