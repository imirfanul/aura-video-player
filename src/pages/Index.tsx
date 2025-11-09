import { VideoPlayer } from "@/components/VideoPlayer"
import { Card } from "@/components/ui/card"

const Index = () => {
	return (
		<div className="min-h-screen bg-background py-8 px-4">
			<div className="max-w-6xl mx-auto space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-5xl font-bold text-foreground">
						React VLC Video Player
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						A full-featured video player component with VLC-like
						controls. Perfect for your npm package.
					</p>

					<div className="flex flex-wrap gap-3 justify-center text-sm text-muted-foreground">
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							Space
						</kbd>{" "}
						Play/Pause
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							←/→
						</kbd>{" "}
						Seek 10s
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							↑/↓
						</kbd>{" "}
						Volume
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							M
						</kbd>{" "}
						Mute
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							C
						</kbd>{" "}
						Subtitles
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							F
						</kbd>{" "}
						Fullscreen
						<kbd className="px-2 py-1 bg-muted rounded border border-border">
							P
						</kbd>{" "}
						PiP
					</div>
				</div>

				<Card className="overflow-hidden shadow-2xl border-border">
					<VideoPlayer
						src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
						poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
						subtitles={[
							{
								label: "English",
								language: "en",
								src: "https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt"
							}
						]}
						onPlay={() => console.log("Video playing")}
						onPause={() => console.log("Video paused")}
						onTimeUpdate={(time) =>
							console.log("Time update:", time)
						}
					/>
				</Card>

				<div className="grid md:grid-cols-3 gap-6 text-center">
					<Card className="p-6 border-border">
						<div className="text-4xl mb-3">⚡</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Full-Featured
						</h3>
						<p className="text-sm text-muted-foreground">
							All controls: playback speed, subtitles, PiP,
							fullscreen, volume, and more.
						</p>
					</Card>

					<Card className="p-6 border-border">
						<div className="text-4xl mb-3">📝</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Subtitle Support
						</h3>
						<p className="text-sm text-muted-foreground">
							SRT & VTT subtitle parsing with customizable styling
							and multiple track support.
						</p>
					</Card>

					<Card className="p-6 border-border">
						<div className="text-4xl mb-3">⌨️</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Keyboard Shortcuts
						</h3>
						<p className="text-sm text-muted-foreground">
							Complete keyboard support for power users. Navigate
							without touching your mouse.
						</p>
					</Card>
				</div>

				<Card className="p-8 border-border">
					<h2 className="text-2xl font-bold text-foreground mb-4">
						Installation
					</h2>
					<div className="bg-muted rounded-lg p-4 font-mono text-sm">
						<code className="text-primary">
							npm install react-vlc-player
						</code>
					</div>

					<h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
						Usage
					</h2>
					<div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
						<pre className="text-foreground">
							{`import { VideoPlayer } from 'react-vlc-player';

function App() {
  return (
    <VideoPlayer
      src="video.mp4"
      poster="thumbnail.jpg"
      subtitles={[
        {
          label: 'English',
          language: 'en',
          src: 'subtitles-en.srt'
        }
      ]}
      onPlay={() => console.log('Playing')}
    />
  );
}`}
						</pre>
					</div>
				</Card>

				<div className="text-center text-sm text-muted-foreground">
					<p>Built with React, TypeScript, and Tailwind CSS</p>
				</div>
			</div>
		</div>
	)
}

export default Index
